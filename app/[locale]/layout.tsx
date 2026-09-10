export const dynamic = "force-dynamic";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";
import { OrderProvider } from "@/components/OrderProvider";
import { CartUIProvider } from "@/components/cart/CartUIProvider";
import { HtmlLangSync } from "@/components/HtmlLangSync";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getAllProducts } from "@/lib/catalog/products";
import { getSiteSettings } from "@/lib/cms/site-settings";

function getSiteUrl(): string | undefined { const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL; if (!configured) return undefined; return configured.startsWith("http") ? configured : `https://${configured}`; }
export function generateStaticParams(){return locales.map(locale=>({locale}));}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale:rawLocale}=await params;if(!isLocale(rawLocale))return{};const locale=rawLocale as Locale;const dict=getDictionary(locale);const settings=await getSiteSettings();const seo=settings.seo[locale];const siteUrl=getSiteUrl();return{metadataBase:siteUrl?new URL(siteUrl):undefined,title:{default:seo?.title||dict.meta.home.title,template:`%s | ${seo?.title||dict.meta.home.title}`},description:seo?.description||dict.meta.home.description,openGraph:{title:seo?.ogTitle||seo?.title||dict.meta.home.title,description:seo?.ogDescription||seo?.description||dict.meta.home.description,type:"website",locale:locale==="fr"?"fr_FR":"en_NG",alternateLocale:locale==="fr"?["en_NG"]:["fr_FR"]}};}
export default async function LocaleLayout({children,params}:{children:ReactNode;params:Promise<{locale:string}>}){const {locale:rawLocale}=await params;if(!isLocale(rawLocale))notFound();const locale=rawLocale as Locale;const dict=getDictionary(locale);const [products,siteSettings]=await Promise.all([getAllProducts(),getSiteSettings()]);return <OrderProvider><HtmlLangSync locale={locale}/><CartUIProvider locale={locale} dict={dict} products={products}><div className="flex min-h-screen flex-col"><Nav locale={locale} dict={dict} siteSettings={siteSettings}/><main>{children}</main><Footer locale={locale} dict={dict} siteSettings={siteSettings}/></div></CartUIProvider></OrderProvider>;}
