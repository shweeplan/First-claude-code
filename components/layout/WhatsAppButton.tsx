"use client";

import { siteConfig, whatsappLink } from "@/config/site";
import { useApp } from "@/components/Providers";
import { Icon } from "@/components/ui/Icon";

export function WhatsAppButton() {
  const { t, locale, brand } = useApp();
  const text = siteConfig.whatsappMessage[locale].replace("{name}", brand);
  return (
    <a
      href={whatsappLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp.label")}
      className="group fixed bottom-5 end-5 z-40 flex h-14 items-center gap-0 rounded-full bg-[#25D366] px-[0.95rem] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,.5)] transition-all duration-500 hover:gap-2.5 hover:pe-5 sm:bottom-7 sm:end-7"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/30 [animation-iteration-count:3]" />
      <Icon name="whatsapp" size={26} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-500 group-hover:max-w-[12rem] group-focus-visible:max-w-[12rem]">
        {t("common.whatsappUs")}
      </span>
    </a>
  );
}
