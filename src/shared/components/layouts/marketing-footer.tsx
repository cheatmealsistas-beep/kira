import { MarketingFooterClient } from './marketing-footer-client';

interface MarketingFooterProps {
  locale: string;
}

export async function MarketingFooter({ locale }: MarketingFooterProps) {
  return <MarketingFooterClient locale={locale} />;
}
