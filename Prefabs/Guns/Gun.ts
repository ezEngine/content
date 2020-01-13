import ez = require("TypeScript/ez")

export class MsgFireGun extends ez.Message {
    EZ_DECLARE_MESSAGE_TYPE;

    triggerState: ez.TriggerState;
}

export abstract class Gun extends ez.TypescriptComponent {

    /* BEGIN AUTO-GENERATED: VARIABLES */
    /* END AUTO-GENERATED: VARIABLES */

    protected singleShotPerTrigger: boolean = false;

    private requireSingleShotReset: boolean = false;

    constructor() {
        super()
    }

    shootSoundComponent: ez.FmodEventComponent = null;

    static RegisterMessageHandlers() {

        ez.TypescriptComponent.RegisterMessageHandler(MsgFireGun, "OnMsgFireGun");
    }

    OnSimulationStarted(): void {
        let owner = this.GetOwner();
        
        let node = owner.FindChildByName("ShootSound", true);
        if (node != null) {
            this.shootSoundComponent = node.TryGetComponentOfBaseType(ez.FmodEventComponent);
        }
    }

    OnMsgFireGun(msg: MsgFireGun): void {

        if (msg.triggerState == ez.TriggerState.Deactivated) {
            this.requireSingleShotReset = false;
            return;
        }

        if (this.singleShotPerTrigger) {

            if (msg.triggerState == ez.TriggerState.Activated) {

                if (!this.requireSingleShotReset) {
                    this.requireSingleShotReset = true;
                    this.Fire();
                }
            }
        }
        else {

            this.Fire();
        }
    }

    abstract Fire(): void;

    PlayShootSound(): void {

        if (this.shootSoundComponent != null && this.shootSoundComponent.IsValid()) {
            this.shootSoundComponent.StartOneShot();
        }
    }
}

