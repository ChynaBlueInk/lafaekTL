"use client";
import {useEffect, useRef} from "react";
import * as Phaser from "phaser";

export default function GameCanvas(){
  const containerRef = useRef<HTMLDivElement|null>(null);
  const gameRef = useRef<Phaser.Game|null>(null);

  useEffect(()=>{
    if(!containerRef.current || gameRef.current) return;

    // Helpers for a tiny local save
    const saveKey = "sv_progress";
    const loadCoins = ()=>{ try{ const s = localStorage.getItem(saveKey); return s? JSON.parse(s).coins||0 : 0; }catch{ return 0; } };
    const writeCoins = (coins:number)=>{ try{ localStorage.setItem(saveKey, JSON.stringify({coins})); }catch{} };

    class MainScene extends Phaser.Scene{
      cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      player!: Phaser.GameObjects.Sprite;
      dialogBox!: Phaser.GameObjects.Container;
      dialogText!: Phaser.GameObjects.Text;
      hudCoins!: Phaser.GameObjects.Text;
      coins:number;
      state:{topic:string,completed:boolean};

      constructor(){
        super("main");
        this.state = {topic:"passwords",completed:false};
        this.coins = 0;
      }

      preload(){
        this.load.image("grass","/assets/tiles/grass.png");
        this.load.image("npc","/assets/sprites/npc.png");
        this.load.image("player","/assets/sprites/player.png");
      }

      create(){
        const w = this.scale.width;
        const h = this.scale.height;

        // bootstrap coins from localStorage
        this.coins = loadCoins();

        // background
        this.add.tileSprite(0,0,w,h,"grass").setOrigin(0);

        // player & npc
        this.player = this.add.sprite(160,160,"player").setScale(1.2);
        const npc = this.add.sprite(320,160,"npc").setInteractive({cursor:"pointer"});

        this.cursors = this.input.keyboard!.createCursorKeys();

        npc.on("pointerdown",()=>{ this.openDialog("Oi! Tau hela senha forte ka lae? Klik 'Start' atu aprende!"); });

        // HUD
        this.add.text(12,12,"Arrow keys to move. Click NPC.",{fontSize:"14px",color:"#fff"});
        this.hudCoins = this.add.text(w-140,12,`Coins: ${this.coins}`,{fontSize:"14px",color:"#fff"});

        // dialog
        this.dialogBox = this.add.container(w/2,h-110);
        const panel = this.add.rectangle(0,0,w-40,100,0x000000,0.6).setStrokeStyle(2,0xffffff);
        panel.setOrigin(0.5);
        this.dialogText = this.add.text(-((w-40)/2)+16,-36,"",{fontSize:"16px",wordWrap:{width:w-72}});
        const startBtn = this.add.text((w-40)/2-90,22,"Start ▶",{fontSize:"16px",backgroundColor:"#ffffff",color:"#000",padding:{x:8,y:4}})
          .setInteractive({cursor:"pointer"});
        startBtn.on("pointerdown",()=>{ this.launchQuest_Passwords(); });
        this.dialogBox.add([panel,this.dialogText,startBtn]).setVisible(false);
      }

      openDialog(text:string){
        this.dialogText.setText(text);
        this.dialogBox.setVisible(true);
      }

      closeDialog(){ this.dialogBox.setVisible(false); }

      addCoins(n:number){
        this.coins += n;
        writeCoins(this.coins);
        this.hudCoins.setText(`Coins: ${this.coins}`);
      }

      update(){
        const speed = 140;
        const vx = (this.cursors.left?.isDown? -speed : this.cursors.right?.isDown? speed : 0);
        const vy = (this.cursors.up?.isDown? -speed : this.cursors.down?.isDown? speed : 0);
        this.player.x += vx*this.game.loop.delta/1000;
        this.player.y += vy*this.game.loop.delta/1000;
      }

      launchQuest_Passwords(){
        this.closeDialog();
        this.scene.start("passwordQuest",{returnTo:"main"});
      }
    }

    type QuestData = {returnTo:string};

    class PasswordQuest extends Phaser.Scene{
      score:number;
      returnTo:string;

      constructor(){ super("passwordQuest"); this.score = 0; this.returnTo = "main"; }

      init(data:QuestData){ this.returnTo = data?.returnTo || "main"; }

      create(){
        this.cameras.main.setBackgroundColor("#111111");
        this.add.rectangle(400,240,760,420,0x111111,0.9).setStrokeStyle(2,0xffffff);
        this.add.text(60,60,"Make a strong passphrase. Pick 4 good words:",{fontSize:"18px",color:"#fff"});

        const words = [
          {w:"sun",good:true},{w:"7!",good:true},{w:"Timor",good:true},{w:"1234",good:false},
          {w:"coffee",good:true},{w:"password",good:false},{w:"croc",good:true},{w:"qwerty",good:false}
        ];

        words.forEach((item,i)=>{
          const btn = this.add.text(80+((i%4)*160),120+Math.floor(i/4)*70,item.w,{fontSize:"20px",backgroundColor:"#fff",color:"#000",padding:{x:8,y:4}})
            .setInteractive({cursor:"pointer"});
          btn.on("pointerdown",()=>{
            this.score += item.good? 1 : -1;
            btn.disableInteractive().setAlpha(0.5);
          });
        });

        const submit = this.add.text(600,360,"Submit",{fontSize:"20px",backgroundColor:"#fff",color:"#000",padding:{x:10,y:6}})
          .setInteractive({cursor:"pointer"});
        submit.on("pointerdown",()=>{
          const win = this.score>=3;
          const msg = win? "Labele hatene – great job! +50 coins" : "Need stronger mix. Try again.";
          this.add.text(60,420,msg,{fontSize:"18px",color:"#fff"});

          if(win){
            // Safely add coins to the MainScene HUD and save
            const main = this.scene.get("main") as any;
            if(main && typeof main.addCoins==="function"){ main.addCoins(50); }
            this.time.delayedCall(1200,()=>{ this.scene.start(this.returnTo); });
          }
        });

        // Escape back without reward
        const cancel = this.add.text(60,360,"⟵ Back",{fontSize:"16px",backgroundColor:"#333",color:"#fff",padding:{x:8,y:4}})
          .setInteractive({cursor:"pointer"});
        cancel.on("pointerdown",()=>{ this.scene.start(this.returnTo); });
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 480,
      parent: containerRef.current!,
      backgroundColor: "#103a1a",
      scene: [MainScene, PasswordQuest],
      physics: {default:"arcade"}
    };

    gameRef.current = new Phaser.Game(config);
    return ()=>{ gameRef.current?.destroy(true); gameRef.current = null; };
  },[]);

  return <div ref={containerRef} className="w-full h-[520px] border rounded-md shadow-md" />;
}
