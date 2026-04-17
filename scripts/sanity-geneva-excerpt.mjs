#!/usr/bin/env node
import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
const env = Object.fromEntries(readFileSync('./.env','utf-8').split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>{const[k,...v]=l.split('=');return[k,v.join('=')];}));
const c = createClient({projectId:env.SANITY_PROJECT_ID,dataset:env.SANITY_DATASET,token:env.SANITY_WRITE_TOKEN,apiVersion:'2025-01-01',useCdn:false});
await c.patch('geneva-guide-001').set({
  excerpt: 'How to see Geneva in 2 days: Lake Geneva waterfront, Old Town, UN Palace, and Mont Blanc day trip. CHF prices, practical hours, smart routing — no filler.'
}).commit();
console.log('Excerpt updated');
