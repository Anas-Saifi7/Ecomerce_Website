import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'site',
    },
    shipping: {
      INR: {
        domestic: { type: Number, default: 49 },
        freeAbove: { type: Number, default: 999 },
        international: { type: Number, default: 499 },
      },
      USD: {
        domestic: { type: Number, default: 5 },
        freeAbove: { type: Number, default: 50 },
        international: { type: Number, default: 15 },
      },
    },
    codEnabled: {
      type: Boolean,
      default: true,
    },
    codCountries: {
      type: [String],
      default: ['India', 'IN'],
    },
    tax: {
      INR: { type: Number, default: 0 },
      USD: { type: Number, default: 0 },
    },
    currencies: {
      type: [String],
      default: ['INR', 'USD'],
    },
    storeName: {
      type: String,
      default: 'Halla Bol',
    },
    contact: {
      email: { type: String, default: 'hello@hallabol.com' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

settingsSchema.statics.getSiteSettings = async function getSiteSettings() {
  let settings = await this.findOne({ key: 'site' });
  if (!settings) {
    settings = await this.create({ key: 'site' });
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
