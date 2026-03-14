export function ImageBox({ src, alt, caption, maxWidth = '500px' }:
    { src: string; alt: string; caption?: string; maxWidth?: string }) {
    return (
        <figure className="mx-auto my-8 text-center" style={{ maxWidth }}>
            <img src={src} alt={alt} className="w-full h-auto rounded-lg" />
            {caption && (
                <figcaption className="mt-3 text-sm text-fd-muted-foreground">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
