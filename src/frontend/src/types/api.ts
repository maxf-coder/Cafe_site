export type SiteSettings = {
    [key: string]: string
}

export type SiteImages = {
    [key: string]: {
        src: string,
        alt: string,
    } | null
}