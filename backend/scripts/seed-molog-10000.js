import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";


import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing.");
  if (process.env.SEED_CONFIRM_DATABASE !== "YES") {
    throw new Error("Safety check: set SEED_CONFIRM_DATABASE=YES after verifying your database.");
  }
  const categories = JSON.parse(fs.readFileSync(path.join(__dirname,"../data/categories.json"),"utf8"));
  const products = JSON.parse(fs.readFileSync(path.join(__dirname,"../data/products.json"),"utf8"));
  await mongoose.connect(process.env.MONGO_URI);
  const categoryIdBySlug = new Map();
  for (const c of categories) {
    const doc = await Category.findOneAndUpdate({slug:c.slug},{$set:c},
      {new:true,upsert:true,runValidators:true,setDefaultsOnInsert:true});
    categoryIdBySlug.set(c.slug,doc._id);
  }
  let inserted=0, skipped=0;
  for (let i=0;i<products.length;i+=500) {
    const chunk=products.slice(i,i+500);
    const ready=chunk.map(({categorySlug,...p})=>{
      const category=categoryIdBySlug.get(categorySlug);
      if (!category) throw new Error(`Unknown category slug: ${categorySlug}`);
      return {...p,category};
    });
    const existing=await Product.find({slug:{$in:ready.map(p=>p.slug)}}).select("slug").lean();
    const existingSlugs=new Set(existing.map(p=>p.slug));
    const fresh=ready.filter(p=>!existingSlugs.has(p.slug));
    skipped+=ready.length-fresh.length;
    if (fresh.length) inserted+=(await Product.insertMany(fresh,{ordered:false})).length;
    console.log(`Processed ${Math.min(i+500,products.length)}/${products.length}`);
  }
  console.log({categoriesUpserted:categories.length,productsInserted:inserted,existingProductsSkipped:skipped});
  await mongoose.disconnect();
}
main().catch(async e=>{console.error(e);try{await mongoose.disconnect()}catch{}process.exitCode=1;});
