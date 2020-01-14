import ez = require("TypeScript/ez")
import gun = require("Prefabs/Guns/Gun")

export class MachineGun extends gun.Gun {
    /* BEGIN AUTO-GENERATED: VARIABLES */
    /* END AUTO-GENERATED: VARIABLES */

    constructor() {
        super()

        this.singleShotPerTrigger = false;
    }

    static RegisterMessageHandlers() {

        gun.Gun.RegisterMessageHandlers();

        //ez.TypescriptComponent.RegisterMessageHandler(ez.MsgSetColor, "OnMsgSetColor");
    }

    Tick(): void { }

    GetAmmoClipSize(): number {
        return 30;
    }

    GetAmmoType(): gun.AmmoType {
        return gun.AmmoType.MachineGun;
    }

    Fire(): void {

        let spawn = this.GetOwner().FindChildByName("Spawn").TryGetComponentOfBaseType(ez.SpawnComponent);
        if (spawn.CanTriggerManualSpawn() == false)
            return;

        this.ammoInClip -= 1;

        spawn.TriggerManualSpawn(true, ez.Vec3.ZeroVector());

        this.PlayShootSound();
    }

}

