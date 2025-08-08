const { createClient } = require("@supabase/supabase-js");

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("categories").select("id").limit(1);

    if (error) throw error;
    console.log("✅ Database connected successfully");

    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      if (storageError) throw storageError;
      console.log("✅ Storage access verified");
      console.log("📁 Available buckets:", buckets.map((b) => b.name).join(", "));
    } catch (storageError) {
      console.error("⚠️ Storage access limited:", storageError.message);
    }

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    try {
      const { data: tableExists, error: tableError } = await supabase.from("categories").select("*").limit(0);

      if (tableError) {
        console.log("💡 Creating categories table...");
        console.log("Please run the SQL schema in Supabase dashboard first");
      }
    } catch (secondError) {
      console.error("💡 Hint: Make sure to run the database schema in Supabase first");
    }

    return false;
  }
};

testConnection();

module.exports = { supabase, testConnection };
