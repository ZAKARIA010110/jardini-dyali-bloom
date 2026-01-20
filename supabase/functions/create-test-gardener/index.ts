import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const email = "example@111.com";
    const password = "123456";
    const name = "بستاني تجريبي";

    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError);
      throw listError;
    }

    const existingUser = existingUsers.users.find(u => u.email === email);
    
    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      console.log("User already exists:", userId);
      
      // Update password if needed
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: password,
        email_confirm: true
      });
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          user_type: "gardener"
        }
      });

      if (createError) {
        console.error("Error creating user:", createError);
        throw createError;
      }

      userId = newUser.user.id;
      console.log("Created new user:", userId);
    }

    // Update or create profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        name,
        email,
        user_type: "gardener",
        phone: "+212600000000"
      }, { onConflict: "id" });

    if (profileError) {
      console.error("Error upserting profile:", profileError);
      throw profileError;
    }

    // Create or update gardener profile
    const { error: gardenerProfileError } = await supabaseAdmin
      .from("gardener_profiles")
      .upsert({
        id: userId,
        bio: "بستاني محترف مع خبرة أكثر من 5 سنوات في تصميم وصيانة الحدائق. متخصص في النباتات المحلية وأنظمة الري الحديثة.",
        location: "الدار البيضاء",
        services: ["تصميم الحدائق", "قص العشب", "زراعة الأشجار", "العناية بالنباتات", "صيانة الحدائق", "تقليم الأشجار"],
        experience: "5+ سنوات",
        hourly_rate: 150,
        rating: 4.8,
        review_count: 24,
        is_available: true,
        languages: ["العربية", "الفرنسية"]
      }, { onConflict: "id" });

    if (gardenerProfileError) {
      console.error("Error upserting gardener profile:", gardenerProfileError);
      throw gardenerProfileError;
    }

    // Create default availability (Monday to Saturday, 8 AM to 6 PM)
    const daysOfWeek = [1, 2, 3, 4, 5, 6]; // Monday to Saturday
    
    for (const day of daysOfWeek) {
      await supabaseAdmin
        .from("gardener_availability")
        .upsert({
          gardener_id: userId,
          day_of_week: day,
          start_time: "08:00",
          end_time: "18:00",
          is_available: true
        }, { onConflict: "gardener_id,day_of_week", ignoreDuplicates: true });
    }

    // Create some sample bookings
    const { data: homeowners } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("user_type", "homeowner")
      .limit(3);

    if (homeowners && homeowners.length > 0) {
      const today = new Date();
      const bookingData = [
        {
          gardener_id: userId,
          client_id: homeowners[0].id,
          service: "تصميم الحدائق",
          booking_date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          booking_time: "10:00",
          status: "pending",
          price: 500,
          notes: "حديقة جديدة تحتاج تصميم كامل"
        },
        {
          gardener_id: userId,
          client_id: homeowners[0].id,
          service: "صيانة الحدائق",
          booking_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          booking_time: "14:00",
          status: "confirmed",
          price: 300,
          notes: "صيانة شهرية للحديقة"
        },
        {
          gardener_id: userId,
          client_id: homeowners[0].id,
          service: "قص العشب",
          booking_date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          booking_time: "09:00",
          status: "completed",
          price: 200,
          completed_at: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          completion_notes: "تم قص العشب بنجاح"
        }
      ];

      for (const booking of bookingData) {
        await supabaseAdmin.from("bookings").insert(booking);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test gardener account created successfully",
        credentials: {
          email,
          password,
          userId
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
