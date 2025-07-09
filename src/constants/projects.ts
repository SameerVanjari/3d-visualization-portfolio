export type Project = {
    id: string
    path: string
    title: string
    textures?: string
    effect?: 'particles' | 'paper' | 'combined'
    url: string
}

export const projects: Project[] = [
    {
        id: "img1",
        path: '/gym',
        title: 'Gym Facility',
        textures: 'gym',
        effect: 'combined',
        url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: "img2",
        path: '/real-estate',
        title: 'Real Estate',
        textures: 'realEstate',
        effect: 'combined',
        url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: "img3",
        path: '/museum',
        title: 'Museum',
        textures: 'museum',
        effect: 'combined',
        url: 'https://plus.unsplash.com/premium_photo-1672855928381-c237c6d74760?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
]