import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export const baseOptions: BaseLayoutProps = {
  links: [
    {
      text: 'Docs',
      url: '/docs',
      active: 'nested-url',
    },
    {
      text: 'Components',
      url: '/components',
      active: 'nested-url',
    },
    {
      text: 'Blocks',
      url: '/blocks',
      active: 'nested-url',
    },
  ],
  githubUrl: 'https://github.com/DeDevsClub/design-registry-starter',
  nav: {
    title: (
      <div className="flex items-center gap-2 border border-border hover:bg-muted/60 p-2 rounded-md">
        <Image
          src="/logo.svg"
          alt="Devcn UI Design Registry"
          width={24}
          height={24}
        />
        <span className="font-semibold text-lg">Devcn UI Design Registry</span>
      </div>
    ),
  },
};