import ez = require("TypeScript/ez")

export enum Consumable {
    Health = 0,
    //Armor = 1,

    AmmoTypes_Start = 2,
    Ammo_None = 3,
    Ammo_Pistol = 4,
    Ammo_MachineGun = 5,
    Ammo_Shotgun = 6,
    Ammo_Plasma = 7,
    Ammo_Rocket = 8,
    AmmoTypes_End = 9,
}

export enum Weapon {
    Pistol = 0,
    Shotgun = 1,
    MachineGun = 2,
    PlasmaRifle = 3,
    RocketLauncher = 4,
};

export let MaxConsumableAmount: number[] = []

MaxConsumableAmount[Consumable.Health] = 100;
MaxConsumableAmount[Consumable.Ammo_Pistol] = 50;
MaxConsumableAmount[Consumable.Ammo_MachineGun] = 150;
MaxConsumableAmount[Consumable.Ammo_Shotgun] = 40;
MaxConsumableAmount[Consumable.Ammo_Plasma] = 100;
MaxConsumableAmount[Consumable.Ammo_Rocket] = 20;

