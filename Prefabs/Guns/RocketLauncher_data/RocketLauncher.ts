import ez = require("TypeScript/ez")
import gun = require("Prefabs/Guns/Gun")

export class RocketLauncher extends gun.Gun {
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

        spawn.TriggerManualSpawn(true, ez.Vec3.ZeroVector());

        this.PlayShootSound();
    }

}

