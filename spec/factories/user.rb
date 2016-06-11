FactoryGirl.define do

  factory :user do
    sequence(:email) { |n| "g#{n}@g.com" }
    password "testtest"
    first_name 'Jon'
    last_name 'Snow'
    image_url 'http://placecorgi.com/250'
    city 'San Francisco'
    state 'CA'
    token 'blah123blah'
    strava_id '12345'
    last_login { Time.now }
    created_at { Time.now }
  end
  
end
