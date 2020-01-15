import ez = require("TypeScript/ez")
import _ge = require("Scripting/GameEnums")
import guns = require("Prefabs/Guns/Gun")

export class Pistol extends guns.Gun {


    /* BEGIN AUTO-GENERATED: VARIABLES */
    /* END AUTO-GENERATED: VARIABLES */

    constructor() {
        super()

        this.singleShotPerTrigger = true;
    }

    static RegisterMessageHandlers() {

        guns.Gun.RegisterMessageHandlers();

        //ez.TypescriptComponent.RegisterMessageHandler(ez.MsgSetColor, "OnMsgSetColor");
    }

    Tick(): void { }

    GetAmmoType(): _ge.Consumable {
        return _ge.Consumable.Ammo_Pistol;
    }
    GetAmmoClipSize(): number {
        return 15;
    }

    Fire(): void {

        let spawn = this.GetOwner().FindChildByName("Spawn").TryGetComponentOfBaseType(ez.SpawnComponent);
        if (spawn.CanTriggerManualSpawn() == false)
            return;

        this.ammoInClip -= 1;

        spawn.TriggerManualSpawn(false, ez.Vec3.ZeroVector());

        this.PlayShootSound();

    }

}

