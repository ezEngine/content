import ez = require("TypeScript/ez")

enum ActiveWeapon {
    Gun1,
    Gun2,
    Gun3
};

export class Player2 extends ez.TickedTypescriptComponent {

    /* BEGIN AUTO-GENERATED: VARIABLES */
    /* END AUTO-GENERATED: VARIABLES */

    constructor() {
        super()
    }

    characterControler: ez.CharacterControllerComponent = null;
    camera: ez.GameObject = null;
    input: ez.InputComponent = null;
    headBone: ez.HeadBoneComponent = null;
    gun: ez.GameObject = null;
    flashlight: ez.SpotLightComponent = null;
    activeWeapon: ActiveWeapon = ActiveWeapon.Gun1;
    weapon1: ez.GameObject = null;
    weapon2: ez.GameObject = null;
    weapon3: ez.GameObject = null;
    interact: ez.PxRaycastInteractComponent = null;

    OnSimulationStarted(): void {
        let owner = this.GetOwner();
        this.characterControler = owner.TryGetComponentOfBaseType(ez.CharacterControllerComponent);
        this.camera = owner.FindChildByName("Camera", true);
        this.input = owner.TryGetComponentOfBaseType(ez.InputComponent);
        this.headBone = this.camera.TryGetComponentOfBaseType(ez.HeadBoneComponent);
        this.gun = owner.FindChildByName("Gun", true);
        this.flashlight = this.gun.TryGetComponentOfBaseType(ez.SpotLightComponent);
        this.weapon1 = this.gun.FindChildByName("Weapon1", true);
        this.weapon2 = this.gun.FindChildByName("Weapon2", true);
        this.weapon3 = this.gun.FindChildByName("Weapon3", true);
        this.interact = this.camera.TryGetComponentOfBaseType(ez.PxRaycastInteractComponent);
        this.SetTickInterval(ez.Time.Milliseconds(0));
    }

    Tick(): void {

        if (this.health > 0) {

            // character controller update
            {
                let msg = new ez.MsgMoveCharacterController();

                msg.Jump = this.input.GetCurrentInputState("Jump", false) > 0.5;
                msg.MoveForwards = this.input.GetCurrentInputState("MoveForwards", false);
                msg.MoveBackwards = this.input.GetCurrentInputState("MoveBackwards", false);
                msg.StrafeLeft = this.input.GetCurrentInputState("StrafeLeft", false);
                msg.StrafeRight = this.input.GetCurrentInputState("StrafeRight", false);
                msg.RotateLeft = this.input.GetCurrentInputState("RotateLeft", false);
                msg.RotateRight = this.input.GetCurrentInputState("RotateRight", false);
                msg.Run = this.input.GetCurrentInputState("Run", false) > 0.5;
                msg.Crouch = this.input.GetCurrentInputState("Crouch", false) > 0.5;

                this.characterControler.SendMessage(msg);
            }

            // look up / down
            {
                let up = this.input.GetCurrentInputState("LookUp", false);
                let down = this.input.GetCurrentInputState("LookDown", false);

                this.headBone.ChangeVerticalRotation(down - up);
            }
        }

        ez.Debug.Draw2DText("Health: " + Math.ceil(this.health), new ez.Vec2(10, 10), ez.Color.White(), 32);
    }

    static RegisterMessageHandlers() {

        ez.TypescriptComponent.RegisterMessageHandler(ez.MsgInputActionTriggered, "OnMsgInputActionTriggered");
        ez.TypescriptComponent.RegisterMessageHandler(ez.MsgDamage, "OnMsgMsgDamage");
    }

    OnMsgInputActionTriggered(msg: ez.MsgInputActionTriggered): void {

        if (this.health <= 0)
            return;

        if (msg.TriggerState == ez.TriggerState.Activated) {

            if (msg.InputActionHash == ez.Utils.StringToHash("Flashlight")) {
                this.flashlight.SetActive(!this.flashlight.IsActive());
            }

            if (msg.InputActionHash == ez.Utils.StringToHash("SwitchWeapon1")) {
                this.activeWeapon = ActiveWeapon.Gun1;
            }

            if (msg.InputActionHash == ez.Utils.StringToHash("SwitchWeapon2")) {
                this.activeWeapon = ActiveWeapon.Gun2;
            }

            if (msg.InputActionHash == ez.Utils.StringToHash("SwitchWeapon3")) {
                this.activeWeapon = ActiveWeapon.Gun3;
            }

            if (msg.InputActionHash == ez.Utils.StringToHash("Use")) {
                this.interact.ExecuteInteraction();
            }
        }

        if (msg.InputActionHash == ez.Utils.StringToHash("Shoot")) {

            switch (this.activeWeapon) {
                case ActiveWeapon.Gun1:
                    this.weapon1.TryGetComponentOfBaseType(ez.SpawnComponent).TriggerManualSpawn();
                    break;

                case ActiveWeapon.Gun2:
                    this.weapon2.TryGetComponentOfBaseType(ez.SpawnComponent).TriggerManualSpawn();
                    break;

                case ActiveWeapon.Gun3:
                    this.weapon3.TryGetComponentOfBaseType(ez.SpawnComponent).TriggerManualSpawn();
                    break;
            }

        }
    }

    health: number = 100;

    OnMsgMsgDamage(msg: ez.MsgDamage): void {

        if (this.health <= 0)
            return;

        this.health -= msg.Damage * 2;

        if (this.health <= 0) {
            let owner = this.GetOwner();

            let camera = owner.FindChildByName("Camera");

            let camPos = camera.GetGlobalPosition();

            let go = new ez.GameObjectDesc();
            go.LocalPosition = camera.GetGlobalPosition();
            go.Dynamic = true;

            let rbCam = ez.World.CreateObject(go);

            let rbCamActor = ez.World.CreateComponent(rbCam, ez.PxDynamicActorComponent);
            let rbCamSphere = ez.World.CreateComponent(rbCam, ez.PxShapeSphereComponent);
            rbCamSphere.Radius = 0.3;
            rbCamSphere.CollisionLayer = 2; // debris
            let rbCamLight = ez.World.CreateComponent(rbCam, ez.PointLightComponent);
            rbCamLight.LightColor = ez.Color.DarkRed();
            rbCamLight.Intensity = 200;

            rbCamActor.Mass = 30;
            rbCamActor.LinearDamping = 0.5;
            rbCamActor.AngularDamping = 0.99;
            rbCamActor.AddAngularForce(ez.Vec3.CreateRandomPointInSphere());

            camera.SetParent(rbCam);
        }
    }
}

