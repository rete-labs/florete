import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { SiblingCards } from '@/components/sibling-cards';
import { ImageBox } from '@/components/image-box';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    SiblingCards,
    ImageBox,
  };
}
