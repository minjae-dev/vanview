export enum BusinessCategory {
  RESTAURANT = '식당',
  RETAIL = '소매',
  PERSONAL_SERVICES = '개인 서비스',
  PROFESSIONAL_SERVICES = '전문 서비스',
  ACCOMMODATION = '숙소',
  CAFE = '카페',
}

export enum BusinessSubcategory {
  // 🍽️ Restaurant
  RESTAURANT = 'Restaurant',
  RESTAURANTS = 'Restaurants',
  RESTAURANT_FULL_SERVICE = 'Restaurant - Full Service',
  RESTAURANT_LIMITED_SERVICE = 'Restaurant - Limited Service',

  // 🛍️ Retail
  RETAIL_DEALER = 'Retail Dealer',
  RETAIL_STORE = 'Retail Store',
  RETAIL_TRADE = 'Retail Trade',
  DEALER_RETAIL = 'Dealer – Retail',

  // 💇 Personal Services
  HAIR_SALON = 'Hair Salon',
  BARBER_SHOP = 'Barber Shop',
  BEAUTY_SALON = 'Beauty Salon',
  NAIL_SALON = 'Nail Salon',

  // 👔 Professional Services
  CONSULTANT = 'Consultant',
  CONSULTING_SERVICE = 'Consulting Service',
  BUSINESS_CONSULTING = 'Business Consulting',

  // 🏨 Accommodation
  HOTEL_MOTEL = 'Hotel/Motel',
  SHORT_TERM_RENTAL = 'Short-term Rental',
  LONG_TERM_RENTAL = 'Long-term Rental',

  // ☕ Café
  CAFE = 'Cafe',
  CAFÉ = 'Café',
  COFFEE_SHOP = 'Coffee Shop',
  TEA_HOUSE = 'Tea House',
}

export enum ReviewType {
  INTERVIEW = 'interview',
  WORK = 'work',
}

export enum ReviewTag {
  FRIENDLY_STAFF = 'Friendly Staff',
  GOOD_BENEFITS = 'Good Benefits',
  WORK_LIFE_BALANCE = 'Work-Life Balance',
  FLEXIBLE_SCHEDULE = 'Flexible Schedule',
  OPPORTUNITIES_FOR_GROWTH = 'Opportunities for Growth',
  INCLUSIVE_ENVIRONMENT = 'Inclusive Environment',
  PHYSICALLY_DEMANDING = 'Physically Demanding',
}

export enum DropListItemState {
  TO_VISIT = 'To Visit',
  DROPPED = 'Dropped',
  INTERVIEWED = 'Interviewed',
  HIRED = 'Hired',
  NOT_PURSUING = 'Not Pursuing',
}

export enum DropListItemMethod {
  IN_PERSON = 'in-person',
  EMAIL = 'email',
  PHONE = 'phone',
  ONLINE = 'online',
}
