import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "",
    },
    placement: {
      type: String,
      trim: true,
      default: "home-hero",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
