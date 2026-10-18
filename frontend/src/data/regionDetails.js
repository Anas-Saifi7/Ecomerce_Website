const regionalProfiles = {
  'andhra-pradesh': ['Andhra Pradesh', 'Kalamkari textiles', 'Kondapalli wooden toys', 'Pulihora', 'Sankranti', 'Rice, chillies, tobacco'],
  'arunachal-pradesh': ['Arunachal Pradesh', 'Bamboo crafts', 'Traditional woven textiles', 'Thukpa', 'Losar', 'Rice, maize, oranges'],
  assam: ['Assam', 'Assam tea', 'Muga and Eri silk', 'Khar', 'Bihu', 'Tea, rice, mustard'],
  bihar: ['Bihar', 'Madhubani paintings', 'Bhagalpuri silk', 'Litti chokha', 'Chhath Puja', 'Rice, wheat, maize'],
  chhattisgarh: ['Chhattisgarh', 'Bastar metal crafts', 'Tribal artwork', 'Chila', 'Bastar Dussehra', 'Rice, pulses, millets'],
  goa: ['Goa', 'Cashew products', 'Coconut crafts', 'Fish curry rice', 'Carnival', 'Cashew, coconut, rice'],
  gujarat: ['Gujarat', 'Bandhani textiles', 'Patola weaving', 'Dhokla', 'Navratri', 'Cotton, groundnuts, cumin'],
  haryana: ['Haryana', 'Panipat home textiles', 'Traditional pottery', 'Bajra roti', 'Teej', 'Wheat, mustard, rice'],
  'himachal-pradesh': ['Himachal Pradesh', 'Kullu shawls', 'Wood crafts', 'Dham', 'Kullu Dussehra', 'Apples, maize, wheat'],
  jharkhand: ['Jharkhand', 'Sohrai art', 'Tasar silk', 'Dhuska', 'Sarhul', 'Rice, pulses, forest produce'],
  karnataka: ['Karnataka', 'Mysore silk', 'Channapatna toys', 'Bisi bele bath', 'Mysuru Dasara', 'Coffee, millets, spices'],
  kerala: ['Kerala', 'Coir products', 'Handloom textiles', 'Appam and stew', 'Onam', 'Coconut, spices, rubber'],
  'madhya-pradesh': ['Madhya Pradesh', 'Chanderi textiles', 'Gond paintings', 'Poha', 'Khajuraho Dance Festival', 'Soybean, wheat, pulses'],
  maharashtra: ['Maharashtra', 'Paithani textiles', 'Warli art', 'Puran poli', 'Ganesh Chaturthi', 'Sugarcane, cotton, grapes'],
  manipur: ['Manipur', 'Handwoven textiles', 'Bamboo crafts', 'Eromba', 'Yaoshang', 'Rice, vegetables, fruits'],
  meghalaya: ['Meghalaya', 'Cane and bamboo crafts', 'Handwoven products', 'Jadoh', 'Wangala', 'Rice, oranges, ginger'],
  mizoram: ['Mizoram', 'Traditional woven textiles', 'Bamboo products', 'Bai', 'Chapchar Kut', 'Rice, ginger, fruits'],
  nagaland: ['Nagaland', 'Woven shawls', 'Wood crafts', 'Smoked foods', 'Hornbill Festival', 'Rice, maize, vegetables'],
  odisha: ['Odisha', 'Pattachitra paintings', 'Silver filigree', 'Dalma', 'Rath Yatra', 'Rice, pulses, oilseeds'],
  punjab: ['Punjab', 'Phulkari embroidery', 'Punjabi juttis', 'Makki di roti', 'Baisakhi', 'Wheat, rice, cotton'],
  rajasthan: ['Rajasthan', 'Block-printed textiles', 'Blue pottery', 'Dal baati churma', 'Teej', 'Millets, mustard, pulses'],
  sikkim: ['Sikkim', 'Handwoven textiles', 'Traditional crafts', 'Momos', 'Losar', 'Cardamom, ginger, tea'],
  'tamil-nadu': ['Tamil Nadu', 'Kanchipuram silk', 'Bronze crafts', 'Pongal', 'Pongal festival', 'Rice, bananas, coconuts'],
  telangana: ['Telangana', 'Pochampally ikat', 'Bidriware', 'Hyderabadi biryani', 'Bathukamma', 'Rice, cotton, turmeric'],
  tripura: ['Tripura', 'Bamboo crafts', 'Cane products', 'Mui borok', 'Kharchi Puja', 'Rice, pineapple, rubber'],
  'uttar-pradesh': ['Uttar Pradesh', 'Banarasi silk', 'Lucknow chikankari', 'Awadhi kebabs', 'Holi', 'Wheat, sugarcane, potatoes'],
  uttarakhand: ['Uttarakhand', 'Woollen products', 'Herbal products', 'Kafuli', 'Harela', 'Millets, rice, fruits'],
  'west-bengal': ['West Bengal', 'Bengal handloom', 'Terracotta crafts', 'Rasgulla', 'Durga Puja', 'Rice, jute, tea'],
  'andaman-and-nicobar-islands': ['Andaman and Nicobar Islands', 'Coconut products', 'Island handicrafts', 'Seafood dishes', 'Island cultural celebrations', 'Coconut, tropical fruits'],
  chandigarh: ['Chandigarh', 'Regional handicrafts', 'Home decor', 'Punjabi foods', 'Spring Festival', 'Regional agricultural produce'],
  'dadra-and-nagar-haveli-and-daman-and-diu': ['Dadra and Nagar Haveli and Daman and Diu', 'Bamboo crafts', 'Cane products', 'Coastal foods', 'Regional cultural festivals', 'Rice, millets, coconut'],
  delhi: ['Delhi', 'Handcrafted jewellery', 'Textiles and accessories', 'Chaat', 'Diwali', 'Regional produce from North India'],
  'jammu-and-kashmir': ['Jammu and Kashmir', 'Pashmina shawls', 'Papier-mache crafts', 'Rogan josh', 'Tulip Festival', 'Apples, saffron, walnuts'],
  ladakh: ['Ladakh', 'Pashmina products', 'Woollen crafts', 'Thukpa', 'Losar', 'Apricots, barley, peas'],
  lakshadweep: ['Lakshadweep', 'Coconut products', 'Coir crafts', 'Tuna dishes', 'Island cultural celebrations', 'Coconut, tuna, tropical produce'],
  puducherry: ['Puducherry', 'Handmade paper', 'Textile products', 'South Indian cuisine', 'Pongal', 'Rice, coconuts, groundnuts'],
}

const createProfile = (data) => {
  const [name, mainProduct, secondProduct, food, festival, agriculture] = data

  return {
    name,
    tagline: `Discover the heritage, craftsmanship and regional products of ${name}`,
    overview: `${name} has distinctive cultural traditions, regional foods, local industries and artisan skills. Halla Bol can help customers discover products associated with this region when their origin and maker details are verified.`,
    history: `${name} has a unique regional history shaped by its communities, trade, local traditions and cultural exchanges. Its crafts and food traditions reflect skills passed between generations.`,
    geography: `${name} has landscapes and local conditions that influence agriculture, materials, food production and traditional livelihoods. Product availability varies by district and supplier.`,
    culture: `Local festivals, regional cuisine, traditional arts and community celebrations contribute to the cultural identity of ${name}.`,
    famousPlaces: [
      { name: `${name} heritage sites`, description: `Explore historic landmarks, cultural sites and places connected with the region's heritage.` },
      { name: `${name} local markets`, description: `Discover regional markets and local businesses selling crafts, foods and everyday products.` },
      { name: `${name} artisan communities`, description: `Learn about makers and traditional skills; verify each supplier and product origin before listing.` },
    ],
    products: [
      { name: mainProduct, description: `A regional product or craft associated with ${name}. Verify the maker, origin, materials and quality before sale.` },
      { name: secondProduct, description: `A traditional product category connected with ${name}. Confirm the supplier and product specifications before publishing.` },
    ],
    food: [food, 'Regional snacks and seasonal specialities'],
    festivals: [festival, 'Local fairs and community celebrations'],
    agriculture: agriculture.split(', '),
    hallaBolOpportunities: [
      mainProduct,
      secondProduct,
      'Handcrafted gifts',
      'Regional food products with compliant labels',
      'Home decor and lifestyle products',
      'Verified artisan-made collections',
    ],
    closing: `Halla Bol can showcase products from ${name} by sharing accurate origin details, maker information, materials and quality specifications. Confirm product claims and applicable regulations before publishing listings.`,
  }
}

const regionDetails = Object.fromEntries(
  Object.entries(regionalProfiles).map(([slug, data]) => [slug, createProfile(data)])
)

export default regionDetails
