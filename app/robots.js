import {siteUrl} from '../lib/parties';
export default function robots(){return {rules:[{userAgent:'*',allow:'/',disallow:['/api/']}],sitemap:`${siteUrl}/sitemap.xml`,host:new URL(siteUrl).host}}
