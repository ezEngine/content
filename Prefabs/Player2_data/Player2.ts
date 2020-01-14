import ez = require("TypeScript/ez")

import msgs = require("Scripting/Messages")
import guns = require("Prefabs/Guns/Gun")

enum WeaponType {
    Pistol = 0,
    Shotgun = 1,
    MachineGun = 2,
    PlasmaRifle = 3,
    RocketLauncher = 4,
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
    gunRoot: ez.GameObject = null;
    flashlight: ez.SpotLightComponent = null;
    activeWeapon: WeaponType = WeaponType.Pistol;
    guns: ez.GameObject[] = [];
    gunComp: guns.Gun[] = [];
    interact: ez.PxRaycastInteractComponent = null;
    ammoPouch: guns.AmmoPouch = new guns.AmmoPouch();

    OnSimulationStarted(): void {
        let owner = this.GetOwner();
        this.characterControler = owner.TryGetComponentOfBaseType(ez.CharacterControllerComponent);
        this.camera = owner.FindChildByName("Camera", true);
        this.input = owner.TryGetComponentOfBaseType(ez.InputComponent);
        this.headBone = this.camera.TryGetComponentOfBaseType(ez.HeadBoneComponent);
        this.gunRoot = owner.FindChildByName("Gun", true);
        this.flashlight = this.gunRoot.TryGetComponentOfBaseType(ez.SpotLightComponent);
        this.guns[WeaponType.Pistol] = ez.Utils.FindPrefabRootNode(this.gunRoot.FindChildByName("Pistol", true));
        this.guns[WeaponType.Shotgun] = ez.Utils.FindPrefabRootNode(this.gunRoot.FindChildByName("Shotgun", true));
        this.guns[WeaponType.MachineGun] = ez.Utils.FindPrefabRootNode(this.gunRoot.FindChildByName("MachineGun", true));
        this.guns[WeaponType.PlasmaRifle] = ez.Utils.FindPrefabRootNode(this.gunRoot.FindChildByName("PlasmaRifle", true));
        this.guns[WeaponType.RocketLauncher] = ez.Utils.FindPrefabRootNode(this.gunRoot.FindChildByName("RocketLauncher", true));

        this.interact = this.camera.TryGetComponentOfBaseType(ez.PxRaycastInteractComponent);
        this.SetTickInterval(ez.Time.Milliseconds(0));
    }

    Tick(): void {

        if (this.gunComp[WeaponType.Pistol] == null) {
            this.gunComp[WeaponType.Pistol] = this.guns[WeaponType.Pistol].TryGetScriptComponent("Pistol");
            this.gunComp[WeaponType.Shotgun] = this.guns[WeaponType.Shotgun].TryGetScriptComponent("Shotgun");
            this.gunComp[WeaponType.MachineGun] = this.guns[WeaponType.MachineGun].TryGetScriptComponent("MachineGun");
            this.gunComp[WeaponType.PlasmaRifle] = this.guns[WeaponType.PlasmaRifle].TryGetScriptComponent("PlasmaRifle");
            this.gunComp[WeaponType.RocketLauncher] = this.guns[WeaponType.RocketLauncher].TryGetScriptComponent("RocketLauncher");

            return;
        }

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

        const ammoInClip = this.gunComp[this.activeWeapon].GetAmmoInClip();
        const ammoOfType = this.ammoPouch.ammo[this.gunComp[this.activeWeapon].GetAmmoType()];

        ez.Debug.Draw2DText("Ammo: " + ammoInClip + " / " + ammoOfType, new ez.Vec2(10, 50), ez.Color.White(), 32);
    }

    static RegisterMessageHandlers() {

        ez.TypescriptComponent.RegisterMessageHandler(ez.MsgInputActionTriggered, "OnMsgInputActionTriggered");
        ez.TypescriptComponent.RegisterMessageHandler(ez.MsgDamage, "OnMsgMsgDamage");
        ez.TypescriptComponent.RegisterMessageHandler(msgs.MsgAddHealth, "OnMsgAddHealth");
    }

    OnMsgInputActionTriggered(msg: ez.MsgInputActionTriggered): void {

        if (this.health <= 0)
            return;

        if (msg.TriggerState == ez.TriggerState.Activated) {

            if (msg.InputActionHash == ez.Utils.StringToHash("Flashlight")) {
                this.flashlight.SetActive(!this.flashlight.IsActive());
            }

            if (msg.InputActionHash == ez.Utils.StringToHash("SwitchWeapon1")) {
                this.activeWeapon = WeaponType.Pistol;
            }

            if (msg.InputActionHash == ez.Utils.StringToHash("SwitchWeapon2")) {
                this.activeWeapon = WeaponType.Shotgun;
            }

            if (msg.InputActionHash == ez.Utils.StringToHash("SwitchWeapon3")) {
                this.activeWeapon = WeaponType.MachineGun;
            }

            if (msg.InputActionHash == ez.Utils.StringToHash("SwitchWeapon4")) {
                this.activeWeapon = WeaponType.PlasmaRifle;
            }

            if (msg.InputActionHash == ez.Utils.StringToHash("SwitchWeapon5")) {
                this.activeWeapon = WeaponType.RocketLauncher;
            }

            if (msg.InputActionHash == ez.Utils.StringToHash("Use")) {
                this.interact.ExecuteInteraction();
            }
        }

        if (msg.InputActionHash == ez.Utils.StringToHash("Shoot")) {

            let msgInteract = new guns.MsgGunInteraction();
            msgInteract.keyState = msg.TriggerState;
            msgInteract.ammoPouch = this.ammoPouch;
            msgInteract.interaction = guns.GunInteraction.Fire;

            this.guns[this.activeWeapon].SendMessage(msgInteract);
        }

        if (msg.InputActionHash == ez.Utils.StringToHash("Reload")) {

            let msgInteract = new guns.MsgGunInteraction();
            msgInteract.keyState = msg.TriggerState;
            msgInteract.ammoPouch = this.ammoPouch;
            msgInteract.interaction = guns.GunInteraction.Reload;

            this.guns[this.activeWeapon].SendMessage(msgInteract);
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

    OnMsgAddHealth(msg: msgs.MsgAddHealth): void {


        if (this.health <= 0 || this.health >= 100) {
            msg.return_consumed = false;
            return;
        }

        msg.return_consumed = true;

        this.health = ez.Utils.Clamp(this.health + msg.addHealth, 1, 100);
    }
}

