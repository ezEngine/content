import ez = require("TypeScript/ez")
import gun = require("Prefabs/Guns/Gun")

export class Pistol extends gun.Gun {
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

        this.GetOwner().TryGetComponentOfBaseType(ez.SpawnComponent).TriggerManualSpawn(false, ez.Vec3.ZeroVector());

        this.PlayShootSound();
    }

}

