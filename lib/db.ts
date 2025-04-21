"use server"

import { createServerClient } from "./supabase/server"

// This function will create the necessary tables in your Supabase database
export async function createTables() {
  const supabase = createServerClient()

  try {
    // Create users table if it doesn't exist
    await supabase
      .rpc("create_users_table_if_not_exists", {
        sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      })
      .catch(async (error) => {
        console.error("Error creating users table with RPC:", error)

        // Try direct SQL through Supabase functions if available
        // Note: This requires you to have created a SQL function in Supabase
        console.log("Attempting to create tables through direct insert...")

        // Try to insert a user to create the table
        await supabase
          .from("users")
          .insert({
            email: "erikakusumaw",
            password: "Erikakusumaw@120396",
          })
          .catch((e) => console.error("Could not create users table:", e))
      })

    // Create action_types table if it doesn't exist
    await supabase
      .rpc("create_action_types_table_if_not_exists", {
        sql: `
        CREATE TABLE IF NOT EXISTS action_types (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      })
      .catch(async (error) => {
        console.error("Error creating action_types table with RPC:", error)

        // Try to insert an action type to create the table
        await supabase
          .from("action_types")
          .insert({
            name: "Pemeriksaan Gigi",
            description: "Pemeriksaan rutin kondisi gigi dan mulut",
          })
          .catch((e) => console.error("Could not create action_types table:", e))
      })

    // Create dental_actions table if it doesn't exist
    await supabase
      .rpc("create_dental_actions_table_if_not_exists", {
        sql: `
        CREATE TABLE IF NOT EXISTS dental_actions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          action_type_id UUID REFERENCES action_types(id) ON DELETE CASCADE,
          patient_name TEXT NOT NULL,
          category TEXT NOT NULL CHECK (category IN ('Umum', 'BPJS')),
          is_approved BOOLEAN DEFAULT FALSE,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      })
      .catch(async (error) => {
        console.error("Error creating dental_actions table with RPC:", error)

        // We'll try to create this table later after we have action_types
      })

    return { success: true }
  } catch (error) {
    console.error("Error in createTables:", error)
    return { success: false, error }
  }
}

// This function will seed your database with initial data
export async function seedDatabase() {
  const supabase = createServerClient()

  try {
    // Check if we have users
    const { data: existingUsers } = await supabase.from("users").select("*").eq("email", "erikakusumaw").maybeSingle()

    // Insert initial user if not exists
    if (!existingUsers) {
      await supabase.from("users").insert({
        email: "erikakusumaw",
        password: "password",
      })
    }

    // Check if we have action types
    const { data: existingActionTypes } = await supabase.from("action_types").select("*")

    // Insert initial action types if not exists
    if (!existingActionTypes || existingActionTypes.length === 0) {
      await supabase.from("action_types").insert([
        { name: "Pemeriksaan Gigi", description: "Pemeriksaan rutin kondisi gigi dan mulut" },
        { name: "Pencabutan Gigi", description: "Prosedur pencabutan gigi yang rusak atau bermasalah" },
        { name: "Tambal Gigi", description: "Prosedur penambalan gigi yang berlubang" },
        { name: "Pembersihan Karang Gigi", description: "Prosedur pembersihan karang gigi" },
        { name: "Perawatan Saluran Akar", description: "Prosedur perawatan saluran akar gigi" },
      ])
    }

    return { success: true }
  } catch (error) {
    console.error("Error in seedDatabase:", error)
    return { success: false, error }
  }
}
