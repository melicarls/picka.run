require 'rails_helper'

RSpec.describe Api::UsersController, type: :controller do
  describe '#show' do

    let(:current_user) {User.create({first_name: 'Test', last_name: 'Test',
      city: 'San Francisco', state: 'CA', image_url: 'www.test.com', token: '12345',
      email: 'test@test.com', strava_id:'123', id: '1'})}

    before { get :show}

    it 'assigns @user' do
      expect(assigns(:user).to eq(:current_user))
    end

    it 'returns json' do
      expect(response.content_type).to eq("application/json")
    end

    it 'returns the current user object' do
      expect(response.data.first_name).to eq('Test')
    end

  end

end
