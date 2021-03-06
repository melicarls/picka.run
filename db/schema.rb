# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160527234043) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string   "name"
    t.datetime "date"
    t.float    "distance"
    t.integer  "time"
    t.float    "pace"
    t.float    "map",                         array: true
    t.integer  "strava_id"
    t.float    "start_location",              array: true
    t.float    "end_location",                array: true
    t.float    "elevation_gain"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.integer  "user_id"
    t.integer  "route_id"
  end

  add_index "activities", ["route_id"], name: "index_activities_on_route_id", using: :btree
  add_index "activities", ["user_id"], name: "index_activities_on_user_id", using: :btree

  create_table "routes", force: :cascade do |t|
    t.string   "name"
    t.datetime "last_completed"
    t.float    "distance"
    t.integer  "avg_time"
    t.float    "avg_pace"
    t.float    "map",                         array: true
    t.float    "start_location",              array: true
    t.float    "end_location",                array: true
    t.float    "elevation_gain"
    t.string   "tags",                        array: true
    t.boolean  "favorite"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.integer  "user_id"
  end

  add_index "routes", ["user_id"], name: "index_routes_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "image_url"
    t.string   "city"
    t.string   "state"
    t.string   "token"
    t.string   "email"
    t.string   "strava_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "last_login"
  end

  add_foreign_key "activities", "routes"
  add_foreign_key "activities", "users"
  add_foreign_key "routes", "users"
end
