import { findSiblings } from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';
import { Card, Cards } from 'fumadocs-ui/components/card';

interface SiblingCardsProps {
  path: string;
}

export function SiblingCards({ path }: SiblingCardsProps) {
  const siblings = findSiblings(source.getPageTree(), path);

  // If there are no siblings, return null (or a message)
  if (!siblings || siblings.length === 0) {
    return null;
  }

  return (
    <Cards>
      {siblings.flatMap((peer) => {
        if (peer.type === 'folder' && peer.index) {
          // For a folder, use its index page as the representative card
          const item = peer.index;
          return (
            <Card key={item.url} title={item.name} href={item.url}>
              {item.description}
            </Card>
          );
        }

        if (peer.type === 'page') {
          return (
            <Card key={peer.url} title={peer.name} href={peer.url}>
              {peer.description}
            </Card>
          );
        }

        return [];
      })}
    </Cards>
  );
}
