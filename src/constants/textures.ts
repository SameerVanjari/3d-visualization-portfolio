type TextureItem = {
    texture: string
    label: string
    hotspots: string
}
export const textures: Record<string, TextureItem[]> = {
    gym: [
        {
            texture: '/gym/gym_entrance_4k.hdr',
            label: "Entrance",
            hotspots: 'gym-0'
        },
        {
            texture: '/gym/gym_01_4k.hdr',
            label: "Gym",
            hotspots: 'gym-1'
        },
        {
            texture: '/gym/wrestling_gym_4k.hdr',
            label: "Wrestling Gym",
            hotspots: 'gym-2'
        },
        {
            texture: '/gym/climbing_gym_4k.hdr',
            label: "Climbing Gym",
            hotspots: 'gym-3'
        },
        {
            texture: '/gym/yoga_room_4k.hdr',
            label: "Yoga room",
            hotspots: 'gym-4'
        },

    ],
    realEstate: [
        {
            texture: '/real-estate/reading_room_4k.hdr',
            label: 'Reading room',
            hotspots: 'real_estate-0'
        },
        {
            texture: '/real-estate/photo_studio_loft_hall_4k.hdr',
            label: 'Photo studio Loft',
            hotspots: 'real_estate-1'
        },
        {
            texture: '/real-estate/modern_bathroom_4k.hdr',
            label: 'Bathroom',
            hotspots: 'real_estate-2'
        },
        {
            texture: '/real-estate/storeroom_4k.hdr',
            label: 'Store room',
            hotspots: 'real_estate-3'
        },
        {
            texture: '/real-estate/small_empty_room_1_4k.hdr',
            label: 'Small empty room',
            hotspots: 'real_estate-4'
        },
    ],
    museum: [
        {
            texture: '/hall_of_mammals_4k.hdr',
            label: 'Hall of Mammals',
            hotspots: 'museum-0'
        }
    ]
}