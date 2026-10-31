//=============================================================================
// RPG Maker MZ - SplitBattleMotion
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 分割されたSVバトラー画像を使用可能にします。
 * @author nz_prism
 * @base animatedSVEnemies
 * @orderAfter animatedSVEnemies
 *
 * @help SplitBattleMotion.js
 * ver. 1.0.2
 * 
 * [バージョン履歴]
 * 2023/05/09 1.0.0 リリース
 * 2023/05/13 1.0.1 ステート条件を複数設定できるように修正
 * 2023/08/16 1.0.2 モーション不具合を修正
 * 2024/02/01 1.x.x (by神無月サスケ) TPを最大値に対する％で設定可能に
 * 
 * 分割されたSVバトラー画像を使用可能にするプラグインです。プラグインパラメータ
 * 「モーション画像」に各種画像を設定してください。通常時と特定ステートにかかっ
 * ている時とで別々に設定することができ、ステートは複数のパターンを設定可能で
 * す。また、TPの値に応じて特定のステートを付与したり解除したりする機能も用意さ
 * れています。プラグインパラメータ「TPステート」にて設定可能です。この設定は敵
 * 味方を問わず適用されます。
 * 本プラグインはanimatedSVEnemiesの導入が前提となります。animatedSVEnemiesの
 * 機能により、敵にSVアクター画像を使用することもできます。その場合、敵のメモ欄
 * に以下のように記述してください。
 * SV Actor ID: n
 * nには使用したいSVバトラーが設定されているアクターと同じアクターIDを入力して
 * ください。
 * スキルやアイテムのメモ欄に以下のように記述することで、追加モーションを取らせ
 * ることができます。
 * <motion:追加モーション識別子>
 * 
 * 
 * 利用規約については別紙「ソフトウェア使用許諾契約書」をご覧ください。
 *
 * @param isTpRate
 * @text 割合％？
 * @desc 最大値におけるTPの％？ 実際の数値？
 * @type boolean
 * @on 割合％で指定
 * @off 実際の数値で指定
 * @default false
 * 
 * @param motionImages
 * @text モーション画像
 * @desc アクターの個別モーション画像です。
 * @type struct<actorMotion>[]
 * @default []
 * 
 * @param tpStates
 * @text TPステート
 * @desc TPが一定以上になると付与されるステートの設定です。TP基準値が高いものが優先されます。
 * @type struct<tpState>[]
 * @default []
 *
 */

/*~struct~actorMotion:
 * 
 * @param actorId
 * @text アクターID
 * @desc アクターのIDです。
 * @type actor
 * @default 1
 * 
 * @param normalMotion
 * @text 通常モーション
 * @desc 通常のモーションです。
 * @type struct<motion>
 * @default {"standardMotion":"","walk":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","wait":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","chant":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","guard":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","damage":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","evade":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","thrust":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","swing":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","missile":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","skill":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","spell":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","item":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","escape":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","victory":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","dying":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","abnormal":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","sleep":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","dead":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","extraMotions":"[]"}
 * 
 * @param stateMotions
 * @text ステートモーション
 * @desc 特定のステートにかかっている時のモーションです。上にあるものほど優先されます。
 * @type struct<stateMotion>[]
 * @default []
 * 
 */

/*~struct~stateMotion:
 * 
 * @param stateIds
 * @text ステートID
 * @desc ステートのIDです（複数設定可能）。
 * @type state[]
 * @default []
 * 
 * @param motion
 * @text モーション
 * @desc モーション設定です。
 * @type struct<motion>
 * @default {"standardMotion":"","walk":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","wait":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","chant":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","guard":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","damage":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","evade":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","thrust":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","swing":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","missile":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","skill":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","spell":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","item":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","escape":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","victory":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","dying":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","abnormal":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","sleep":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","dead":"{\"image\":\"\",\"numPatterns\":\"1\",\"loopType\":\"0\",\"duration\":\"20\"}","extraMotions":"[]"}
 * 
 */

/*~struct~motion:
 * 
 * @param standardMotion
 * @text 標準モーション
 * @desc 標準のモーションです。
 * 
 * @param walk
 * @text 前進モーション
 * @desc 前進のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param wait
 * @text 通常待機モーション
 * @desc 通常待機のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param chant
 * @text 詠唱待機モーション
 * @desc 詠唱待機のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param guard
 * @text 防御モーション
 * @desc 防御のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param damage
 * @text ダメージモーション
 * @desc ダメージのモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param evade
 * @text 回避モーション
 * @desc 回避のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param thrust
 * @text 突きモーション
 * @desc 突きのモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param swing
 * @text 振りモーション
 * @desc 振りのモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param missile
 * @text 飛び道具モーション
 * @desc 飛び道具のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param skill
 * @text 汎用スキルモーション
 * @desc 汎用スキルのモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param spell
 * @text 魔法モーション
 * @desc 魔法のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param item
 * @text アイテムモーション
 * @desc アイテムのモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param escape
 * @text 逃げるモーション
 * @desc 逃げるのモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param victory
 * @text 勝利モーション
 * @desc 勝利のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param dying
 * @text 瀕死モーション
 * @desc 瀕死のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param abnormal
 * @text 状態異常モーション
 * @desc 状態異常のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param sleep
 * @text 睡眠モーション
 * @desc 睡眠のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param dead
 * @text 戦闘不能モーション
 * @desc 戦闘不能のモーションです。
 * @parent standardMotion
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 * @param extraMotions
 * @text 追加モーション
 * @desc 追加のモーションです。
 * @type struct<extraMotion>[]
 * @default []
 * 
 */

/*~struct~extraMotion:
 * 
 * @param identifier
 * @text モーション識別子
 * @desc モーションの識別子（名称）です。半角英数で命名してください。
 * @type string
 * 
 * @param motion
 * @text モーション設定
 * @desc モーションの設定です。
 * @type struct<motionSetting>
 * @default {"image":"","numPatterns":"1","loopType":"0","duration":"20"}
 * 
 */

/*~struct~motionSetting:
 * 
 * @param image
 * @text モーション画像
 * @desc モーションの画像です。
 * @type file
 * @dir img/sv_actors
 * 
 * @param numPatterns
 * @text コマ数
 * @desc モーションのコマ数です。
 * @type number
 * @default 1
 * @min 1
 * 
 * @param loopType
 * @text ループ種別
 * @desc ループの種別です。
 * @default 0
 * @type select
 * @option ループ無し
 * @value 0
 * @option 一方通行ループ
 * @value 1
 * @option 往復ループ
 * @value 2
 * 
 * @param duration
 * @text １コマ毎のウェイト
 * @desc モーションの１コマあたりのウェイト（フレーム数）です。ループなしの場合無視して問題ありません。
 * @type number
 * @default 20
 * @min 1
 * 
 */

/*~struct~tpState:
 * 
 * @param tpThreshold
 * @text TP基準値
 * @desc TPがこの値以上になるとステートが付与される基準値です。
 * @type number
 * @default 50
 * @min 0
 * @max 99999999
 * 
 * @param statesToAdd
 * @text 付与ステート
 * @desc 付与されるステートです（複数設定可能）。
 * @type state[]
 * @default []
 * 
 * @param statesToRemove
 * @text 解除ステート
 * @desc 解除されるステートです（複数設定可能）。
 * @type state[]
 * @default []
 * 
 */

(() => {
    'use strict';
    const PLUGIN_NAME = "SplitBattleMotion";
    const pluginParams = PluginManager.parameters(PLUGIN_NAME);

    // const parameters = PluginManager.parameters(pluginName);
    const isTpRate = JSON.parse(pluginParams['isTpRate']);

    const convertMotionStringToObject = function(string) {
        const result = {};
        for (const ary of Object.entries(JSON.parse(string))) {
            const key = ary[0];
            switch (key) {
                case "standardMotion":
                    break;
                case "extraMotions":
                    for (const extraStr of JSON.parse(ary[1])) {
                        const extraObj1 = JSON.parse(extraStr);
                        const extraObj2 = JSON.parse(extraObj1.motion);
                        extraObj2.numPatterns = Number(extraObj2.numPatterns);
                        extraObj2.loopType = Number(extraObj2.loopType);
                        extraObj2.duration = Number(extraObj2.duration);
                        result[extraObj1.identifier] = extraObj2;
                    }
                    break;
                default:
                    const standardObj = JSON.parse(ary[1]);
                    standardObj.numPatterns = Number(standardObj.numPatterns);
                    standardObj.loopType = Number(standardObj.loopType);
                    standardObj.duration = Number(standardObj.duration);
                    result[key] = standardObj;
                    break;
            }
        }
        return result;
    };

    const MOTION_DATA = [];
    for (const str1 of JSON.parse(pluginParams.motionImages)) {
        const motion = {};
        const states = [];
        const obj1 = JSON.parse(str1);
        const normal = convertMotionStringToObject(obj1.normalMotion);
        for (const str of JSON.parse(obj1.stateMotions)) {
            const stateObj = JSON.parse(str);
            const stateIds = JSON.parse(stateObj.stateIds).map(s => Number(s));
            const stateAry = [stateIds, convertMotionStringToObject(stateObj.motion)];
            states.push(stateAry);
        }
        motion.normalMotion = normal;
        motion.stateMotions = states;
        MOTION_DATA[Number(obj1.actorId)] = motion;
    }

    const TP_STATES = [];
    for (const str1 of JSON.parse(pluginParams.tpStates)) {
        const tpState = {};
        const obj = JSON.parse(str1);
        tpState.tpThreshold = Number(obj.tpThreshold);
        tpState.statesToAdd = JSON.parse(obj.statesToAdd).map(str2 => Number(str2));
        tpState.statesToRemove = JSON.parse(obj.statesToRemove).map(str2 => Number(str2));
        TP_STATES.push(tpState);
    }
    TP_STATES.sort((a, b) => b.tpThreshold - a.tpThreshold);


    const _Game_Battler_prototype_refresh = Game_Battler.prototype.refresh;
    Game_Battler.prototype.refresh = function() {
        _Game_Battler_prototype_refresh.call(this);
        this.updateTpStates();
    };

    Game_Battler.prototype.updateTpStates = function() {
        const tp = this._tp;
        for (const tpState of TP_STATES) {
            const base = tpState.tpThreshold;
            const threshould = isTpRate ? this.maxTp() * base / 100 : base;
            if (tp >= threshould) {
                tpState.statesToAdd.forEach(stateId => this.addState(stateId));
                tpState.statesToRemove.forEach(stateId => this.removeState(stateId));
                break;
            }
        }
    };

    Game_Battler.prototype.motionData = function() {
        const data = MOTION_DATA[this.motionId()];
        if (data) {
            for (const ary of data.stateMotions) {
                if (ary[0].every(stateId => this.isStateAffected(stateId))) {
                    return ary[1];
                }
            }
            return data.normalMotion;
        }
        return null;
    };

    const _Game_Actor_prototype_performAction = Game_Actor.prototype.performAction;
    Game_Actor.prototype.performAction = function(action) {
        const motion = action.item().meta.motion;
        if (motion) {
            this.requestMotion(motion);
        } else {
            _Game_Actor_prototype_performAction.call(this, action);
        }
    };

    Game_Actor.prototype.motionId = function() {
        return this._actorId;
    };

    Game_Enemy.prototype.motionId = function() {
        return this._motionId;
    };


    const _Sprite_Actor_prototype_initMembers = Sprite_Actor.prototype.initMembers;
    Sprite_Actor.prototype.initMembers = function() {
        _Sprite_Actor_prototype_initMembers.call(this);
        this._motionNumPatterns = 1;
        this._motionLoopType = 0;
        this._motionDuration = 0;
        this._motionReversing = false;
    };
    
    const _Sprite_Actor_prototype_startMotion = Sprite_Actor.prototype.startMotion;
    Sprite_Actor.prototype.startMotion = function(motionType) {
        const motionData = this._battler.motionData();
        if (motionData) {
            const newMotion = motionData[motionType];
            if (newMotion && this._motion !== newMotion) {
                const name = newMotion.image;
                this._battlerName = name;
                this._mainSprite.bitmap = ImageManager.loadSvActor(name);
                this._motion = newMotion;
                this._motionNumPatterns = newMotion.numPatterns;
                this._motionLoopType = newMotion.loopType;
                this._motionDuration = newMotion.duration;
                this._motionReversing = false;
                this._motionCount = 0;
                this._pattern = 0;
                this.updateFrame();
            }
        } else {
            _Sprite_Actor_prototype_startMotion.call(this, motionType);
        }
    };

    const _Sprite_Actor_prototype_updateBitmap = Sprite_Actor.prototype.updateBitmap;
    Sprite_Actor.prototype.updateBitmap = function() {
        if (!this._motion || !this._motion.numPatterns) _Sprite_Actor_prototype_updateBitmap.call(this);
    };

    const _Sprite_Actor_prototype_updateFrame = Sprite_Actor.prototype.updateFrame;
    Sprite_Actor.prototype.updateFrame = function() {
        if (this._motion?.numPatterns) {
            Sprite_Battler.prototype.updateFrame.call(this);
            const bitmap = this._mainSprite.bitmap;
            if (bitmap) {
                const numPatterns = this._motionNumPatterns;
                const pattern = this._pattern < numPatterns ? this._pattern : 0;
                const cw = bitmap.width / numPatterns;
                const ch = bitmap.height;
                const cx = cw * pattern;
                const cy = 0;
                this._mainSprite.setFrame(cx, cy, cw, ch);
                this.setFrame(0, 0, cw, ch);
            }
        } else {
            _Sprite_Actor_prototype_updateFrame.call(this);
        }
    };

    const _Sprite_Actor_prototype_updateMotionCount = Sprite_Actor.prototype.updateMotionCount;
    Sprite_Actor.prototype.updateMotionCount = function() {
        if (this._motion?.numPatterns) {
            if (++this._motionCount >= this.motionSpeed()) {
                const numPatterns = this._motionNumPatterns;
                switch (this._motionLoopType) {
                    case 1:
                        this._pattern++;
                        if (this._pattern >= numPatterns) this._pattern = 0;
                        break;
                    case 2:
                        if (this._motionReversing) {
                            this._pattern--;
                            if (this._pattern < 0) {
                                this._pattern = 1;
                                this._motionReversing = false;
                            }
                        } else {
                            this._pattern++;
                            if (this._pattern >= numPatterns) {
                                this._pattern = numPatterns - 2;
                                this._motionReversing = true;
                            }
                        }
                        break;
                    default:
                        if (numPatterns > 1) {
                            this._pattern++;
                            if (this._pattern >= numPatterns) this.refreshMotion();
                        } else {
                            this._pattern = 0;
                        }
                        break;
                }
                this._motionCount = 0;
            }
        } else {
            _Sprite_Actor_prototype_updateMotionCount.call(this);
        }
    };
    
    const _Sprite_Actor_prototype_motionSpeed = Sprite_Actor.prototype.motionSpeed;
    Sprite_Actor.prototype.motionSpeed = function() {
        return this._motion?.numPatterns ? this._motionDuration : _Sprite_Actor_prototype_motionSpeed.call(this);
    };


    const _Sprite_EnemyRex_prototype_updateBitmap = Sprite_EnemyRex.prototype.updateBitmap;
    Sprite_EnemyRex.prototype.updateBitmap = function() {
        if (this._motion?.numPatterns) {
            this.updateEffect();
            this._mainSprite.scale.x = -this._actor._scale;
            this._mainSprite.scale.y = this._actor._scale;
            this._mainSprite.anchor.x = this._actor._anchor[0];
            this._mainSprite.anchor.y = this._actor._anchor[1];
        } else {
            _Sprite_EnemyRex_prototype_updateBitmap.call(this);
        }
    };


    const _Rexal_ASVE_processEnemyData = Rexal.ASVE.processEnemyData;
    Rexal.ASVE.processEnemyData = function(obj,obj2) {
        _Rexal_ASVE_processEnemyData.call(this,obj,obj2);
        obj._motionId = obj2.motionId;
    }

    Rexal.ASVE.processEnemyNoteTag = function(obj) {

        Rexal.log('reading ' + obj.name + '...');
        
        obj.motion = 'thrust';
        obj.weaponid = 0;
        obj.collapse = Rexal.ASVE.DoCollapse;
        obj.breath = [50,5,25];
        obj.scale = 1.0;
        obj.weaponscale = 0.0;
        obj.weaponanchor = [.5,1];
        obj.anchor = [.5,1];
        obj.motionId = 0;
        
        if(obj == null)return;
        
                var notedata = obj.note.split(/[\r\n]+/);
        
                for (var i = 0; i < notedata.length; i++) {
                var line = notedata[i];
                var lines = line.split(': ');
                
                switch (lines[0].toLowerCase()) {
                
                case '[sv animated]' :
                obj.animated = true;
                Rexal.log(obj.name + ' is using SV Battler sprites','info');
                break;

                case 'sv actor id' :
                obj.animated = true;
                obj.motionId = parseInt(lines[1]);
                Rexal.log(obj.name + ' is using SV Battler sprites of actor','info');
                break;
                
                case 'sv motion' :
                obj.motion = lines[1].toLowerCase();
                Rexal.log(obj.name + "'s attack motion is:" + obj.motion,'info');
                break;
                
                case 'sv weapon' :
                obj.weaponid = parseInt(lines[1]);
                Rexal.log(obj.name + " has weapon " + $dataWeapons[obj.weaponid].name,'info');
                break;
                
                case '[breathless]' :
                obj.breathless = true;
                Rexal.log(obj.name + " is breathless.",'info');
                break;	
                
                case '[float]' :
                obj.floating = true;
                Rexal.log(obj.name + " floats.",'info');
                break;	
                
                case '[collapse]' :
                obj.collapse = true;
                Rexal.log(obj.name + " can collapse.",'info');		
                break;	
                
                case '[no collapse]' :
                obj.collapse = false;
                Rexal.log(obj.name + " cannot collapse.",'info');	
                break;
                
                case 'breath control' :
                
                var lines2 = lines[1].split(',');
                obj.breath[0] = parseInt(lines2[0]);
                obj.breath[1] = parseInt(lines2[1]);
                obj.breath[2] = parseInt(lines2[2]);
                Rexal.log(obj.name + "'s breath control: " + obj.breath,'info');
                break;
                
                case 'enemy scale' :
                obj.scale = parseFloat(lines[1]);
                Rexal.log(obj.name + " is " + obj.scale +"x bigger than normal.",'info');
                break;
                
                case 'sv weapon scale' :
                obj.weaponscale = parseFloat(lines[1])-1;
                Rexal.log(obj.name + "'s weapon is " + obj.scale +"x bigger than normal.",'info');
                break;		
                
                case 'sv weapon anchor' :
                
                var lines2 = lines[1].split(',');
                obj.weaponanchor[0] = parseFloat(lines2[0]);
                obj.weaponanchor[1] = parseFloat(lines2[1]);
                Rexal.log(obj.name + "'s weapon is anchored to " + obj.weaponanchor[0] +" and " + obj.weaponanchor[1],'info');
                break;		
                
                case 'sv anchor' : //WIP
                
                var lines2 = lines[1].split(',');
                obj.anchor[0] = parseFloat(lines2[0]);
                obj.anchor[1] = parseFloat(lines2[1]);
                Rexal.log(obj.name + " is anchored to " + obj.anchor[0] +" and " + obj.anchor[1],'info');
                break;		
                
                }
                
                    
                }
                return obj;
        };

})();
