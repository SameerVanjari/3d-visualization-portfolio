type Hotspot = {
    id: string
    position: [number, number, number]
    description: string;
    title: string
}

type TextureItem = {
    texture: string
    label: string
    hotspots: Hotspot[]
}

// Assign random positions directly to each hotspot in the textures arrays
function randomPositionInsideSphere(radius: number = 60): [number, number, number] {
    const u = Math.random();
    const v = Math.random();
    const w = Math.random();

    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(w);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    return [x, y, z];
}

export const textures: Record<string, TextureItem[]> = {
    gym: [
        {
            texture: '/gym/gym_entrance_4k.hdr',
            label: "Entrance",
            hotspots: [{
                id: 'gym-0',
                position: randomPositionInsideSphere(),
                description: 'Entrance to the gym',
                title: 'Gym Entrance'
            }]
        },
        {
            texture: '/gym/gym_01_4k.hdr',
            label: "Gym",
            hotspots: [{
                id: 'gym-1',
                position: randomPositionInsideSphere(),
                description: 'Main area of the gym',
                title: 'Gym Area'
            }]
        },
        {
            texture: '/gym/wrestling_gym_4k.hdr',
            label: "Wrestling Gym",
            hotspots: [{
                id: 'gym-2',
                position: randomPositionInsideSphere(),
                description: 'Wrestling area with mats',
                title: 'Wrestling Area'
            }]
        },
        {
            texture: '/gym/climbing_gym_4k.hdr',
            label: "Climbing Gym",
            hotspots: [{
                id: 'gym-3',
                position: randomPositionInsideSphere(),
                description: 'Climbing area with walls',
                title: 'Climbing Area'
            }]
        },
        {
            texture: '/gym/yoga_room_4k.hdr',
            label: "Yoga room",
            hotspots: [{
                id: 'gym-4',
                position: randomPositionInsideSphere(),
                description: 'Yoga area with mats',
                title: 'Yoga Area'
            }]
        },

    ],
    realEstate: [
        {
            texture: '/real-estate/reading_room_4k.hdr',
            label: 'Reading room',
            hotspots: [{
                id: 'real_estate-0',
                position: randomPositionInsideSphere(),
                description: 'Cozy reading nook',
                title: 'Reading Room'
            }]
        },
        {
            texture: '/real-estate/photo_studio_loft_hall_4k.hdr',
            label: 'Photo studio Loft',
            hotspots: [{
                id: 'real_estate-1',
                position: randomPositionInsideSphere(),
                description: 'Bright photo studio with large windows',
                title: 'Photo Studio Loft'
            }]
        },
        {
            texture: '/real-estate/modern_bathroom_4k.hdr',
            label: 'Bathroom',
            hotspots: [{
                id: 'real_estate-2',
                position: randomPositionInsideSphere(),
                description: 'Modern bathroom with shower',
                title: 'Bathroom'
            }]
        },
        {
            texture: '/real-estate/storeroom_4k.hdr',
            label: 'Store room',
            hotspots: [{
                id: 'real_estate-3',
                position: randomPositionInsideSphere(),
                description: 'Small storeroom',
                title: 'Store Room'
            }]
        },
        {
            texture: '/real-estate/small_empty_room_1_4k.hdr',
            label: 'Small empty room',
            hotspots: [{
                id: 'real_estate-4',
                position: randomPositionInsideSphere(),
                description: 'Small empty room',
                title: 'Small Empty Room'
            }]
        },
    ],
    museum: [
        {
            texture: '/hall_of_mammals_4k.hdr',
            label: 'Hall of Mammals',
            hotspots: [{
                id: 'museum-0',
                position: randomPositionInsideSphere(),
                description: 'Exhibit of various mammals',
                title: 'Hall of Mammals'
            }]
        }
    ]
}
