import ez = require("TypeScript/ez")
import gun = require("Prefabs/Guns/Gun")

export class Shotgun extends gun.Gun {
    /* BEGIN AUTO-GENERATED: VARIABLES */
    /* END AUTO-GENERATED: VARIABLES */

    constructor() {
        super()

        this.singleShotPerTrigger = true;
    }

    static RegisterMessageHandlers() {

        gun.Gun.RegisterMessageHandlers();

        //ez.TypescriptComponent.RegisterMessageHandler(ez.MsgSetColor, "OnMsgSetColor");
    }

    Fire(): void {

        let spawn = this.GetOwner().FindChildByName("Spawn").TryGetComponentOfBaseType(ez.SpawnComponent);
        if (spawn.CanTriggerManualSpawn() == false)
            return;

        for (let i = 0; i < 8; ++i) {
            spawn.TriggerManualSpawn(true, new ez.Vec3(ez.Random.DoubleMinMax(-0.05, 0.05), 0, 0));
        }

        this.PlayShootSound();
    }

}

