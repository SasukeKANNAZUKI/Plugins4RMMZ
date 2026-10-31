//=============================================================================
// Plugin for RPG Maker MZ
// SetMpNameForEachActor.js
//=============================================================================
// [Update History]
// 2021.Sep.26 Ver1.0.0 First Release

/*:
 * @target MZ
 * @plugindesc Enable actors have special name to hp/mp/tp
 * @author Sasuke KANNAZUKI
 *
 * @command changeHp
 * @text Change HP Name
 * @desc Ex. LP, VP
 *
 * @arg actorId
 * @text Actor ID
 * @desc The target to change the name
 * @type actor
 * @default 1
 *
 * @arg name1
 * @text New name
 * @desc New name of HP
 * @type string
 * @default HP
 *
 * @arg name2
 * @text New name(abbr.)
 * @desc New name of HP(abbr.)
 * @type string
 * @default HP
 *
 * @arg gauge1
 * @text Gauge Color(Left)
 * @desc Default:20
 * @type number
 * @min 0
 * @default 20
 *
 * @arg gauge2
 * @text Gauge Color(Right)
 * @desc Default:21
 * @type number
 * @min 0
 * @default 21
 *
 * @command changeMp
 * @text Change MP Name
 * @desc Ex. PP, SP
 *
 * @arg actorId
 * @text Actor ID
 * @desc The target to change the name
 * @type actor
 * @default 1
 *
 * @arg name1
 * @text New name
 * @desc New name of MP
 * @type string
 * @default MP
 *
 * @arg name2
 * @text New name(abbr.)
 * @desc New name of MP(abbr.)
 * @type string
 * @default MP
 *
 * @arg gauge1
 * @text Gauge Color(Left)
 * @desc Default:22
 * @type number
 * @min 0
 * @default 22
 *
 * @arg gauge2
 * @text Gauge Color(Right)
 * @desc Default:23
 * @type number
 * @min 0
 * @default 23
 *
 * @command changeTp
 * @text Change TP Name
 * @desc Ex. AP, XP
 *
 * @arg actorId
 * @text Actor ID
 * @desc The target to change the name
 * @type actor
 * @default 1
 *
 * @arg name1
 * @text New name
 * @desc New name of TP
 * @type string
 * @default TP
 *
 * @arg name2
 * @text New name(abbr.)
 * @desc New name of TP(abbr.)
 * @type string
 * @default TP
 *
 * @arg gauge1
 * @text Gauge Color(Left)
 * @desc Default:28
 * @type number
 * @min 0
 * @default 28
 *
 * @arg gauge2
 * @text Gauge Color(Right)
 * @desc Default:29
 * @type number
 * @min 0
 * @default 29
 *
 * @help 
 * This plugin runs under RPG Maker MZ.
 *
 * [Summary]
 * This plugin enables to change the name of each actor's HP/MP/TP.
 * This plugin also be able to set gauge graduation colors.
 *
 * To set this, call plugin commands.
 *
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc HP/TP/MPの名前をアクター毎に変更できます
 * @author 神無月サスケ
 *
 * @command changeHp
 * @text HPの名称変更
 * @desc LP, VPなどに変更できます
 *
 * @arg actorId
 * @text アクターID
 * @desc HPの名前を変えるアクターです
 * @type actor
 * @default 1
 *
 * @arg name1
 * @text 新しい名前
 * @desc HPからこの名前に変更します。
 * @type string
 * @default HP
 *
 * @arg name2
 * @text 新しい名前(略)
 * @desc HP(略)の名前を設定します。
 * @type string
 * @default HP
 *
 * @arg gauge1
 * @text ゲージ色(左側)
 * @desc Default:20
 * @type number
 * @min 0
 * @default 20
 *
 * @arg gauge2
 * @text ゲージ色(右側)
 * @desc Default:21
 * @type number
 * @min 0
 * @default 21
 *
 * @command changeMp
 * @text MPの名称変更
 * @desc PP, SPなど自由に変更可能です
 *
 * @arg actorId
 * @text アクターID
 * @desc MPの名前を変えるアクターです。
 * @type actor
 * @default 1
 *
 * @arg name1
 * @text 新しい名前
 * @desc MPからこの名前に変更します。
 * @type string
 * @default MP
 *
 * @arg name2
 * @text 新しい名前(略)
 * @desc MP(略)の名前を設定します。
 * @type string
 * @default MP
 *
 * @arg gauge1
 * @text ゲージ色(左側)
 * @desc Default:22
 * @type number
 * @min 0
 * @default 22
 *
 * @arg gauge2
 * @text ゲージ色(右側)
 * @desc Default:23
 * @type number
 * @min 0
 * @default 23
 *
 * @command changeTp
 * @text TPの名称変更
 * @desc AP, XPなど自由に設定可能です
 *
 * @arg actorId
 * @text アクターID
 * @desc TPの名前を変えるアクターです
 * @type actor
 * @default 1
 *
 * @arg name1
 * @text 新しい名前
 * @desc TPからこの名前に変更します
 * @type string
 * @default TP
 *
 * @arg name2
 * @text 新しい名前(略)
 * @desc TP(略)の名前を設定します
 * @type string
 * @default TP
 *
 * @arg gauge1
 * @text ゲージ色(左側)
 * @desc Default:28
 * @type number
 * @min 0
 * @default 28
 *
 * @arg gauge2
 * @text ゲージ色(右側)
 * @desc Default:29
 * @type number
 * @min 0
 * @default 29
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * ■概要
 * このプラグインは、HP/MP/TPといった全アクター共通のリソース名を
 * アクター毎に置き換えることが可能です。
 * 同時に、ゲージの色の変更も可能です。
 *
 * 設定はプラグインコマンドから行ってください。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'SetMpNameForEachActor';

  //
  // process plugin commands
  //
  const changeSomething = (args, textIndex, gaugeIndex) => {
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      if (!actor.basicText) {
        actor.basicText = [];
      }
      actor.basicText[textIndex] = args.name1;
      actor.basicText[textIndex + 1] = args.name2;
      if (!actor.myGaugeColors) {
        actor.myGaugeColors = [];
      }
      actor.myGaugeColors[gaugeIndex] = +args.gauge1;
      actor.myGaugeColors[gaugeIndex + 1] = +args.gauge2;
    }
  };

  PluginManager.registerCommand(pluginName, 'changeHp', args => {
    changeSomething(args, 2, 0);
  });

  PluginManager.registerCommand(pluginName, 'changeMp', args => {
    changeSomething(args, 4, 2);
  });

  PluginManager.registerCommand(pluginName, 'changeTp', args => {
    changeSomething(args, 6, 4);
  });

  //
  // global variable in this plugins
  //
  let currentActor = null;

  //
  // check if it is special text for the actor
  //
  const _TextManager_basic = TextManager.basic;
  TextManager.basic = function(basicId) {
    // 2:hp, 3:hpA, 4:mp, 5:mpA, 6:tp 7:tpA
    if (currentActor && currentActor.basicText) {
      const text = currentActor.basicText[basicId];
      if (text) {
        return text;
      }
    }
    return _TextManager_basic.call(this, basicId);
  };

  //
  // set global variable for actor
  //

  const _Sprite_Gauge_redraw = Sprite_Gauge.prototype.redraw;
  Sprite_Gauge.prototype.redraw = function() {
    currentActor = this._battler;
    _Sprite_Gauge_redraw.call(this);
    currentActor = null;
  };

  const _Window_BattleLog_displayDamage =
   Window_BattleLog.prototype.displayDamage;
  Window_BattleLog.prototype.displayDamage = function(target) {
    currentActor = target;
    _Window_BattleLog_displayDamage.call(this, target);
    currentActor = null;
  };

  //
  // obtain special gauge color
  //

  // actor.myGaugeColors
  // 0,1:hpGaugeColor 2,3:mpGaugeColor 4,5:tpGaugeColor

  ColorManager._setGaugeColor = function(id, originalFunc) {
    let colors;
    if (currentActor && (colors = currentActor.myGaugeColors)) {
      if (colors[id] != null) {
        return this.textColor(colors[id]);
      }
    }
    return originalFunc.call(this);
  };

  const _ColorManager_hpGaugeColor1 = ColorManager.hpGaugeColor1;
  ColorManager.hpGaugeColor1 = function() {
    return this._setGaugeColor(0, _ColorManager_hpGaugeColor1);
  };

  const _ColorManager_hpGaugeColor2 = ColorManager.hpGaugeColor2;
  ColorManager.hpGaugeColor2 = function() {
    return this._setGaugeColor(1, _ColorManager_hpGaugeColor2);
  };

  const _ColorManager_mpGaugeColor1 = ColorManager.mpGaugeColor1;
  ColorManager.mpGaugeColor1 = function() {
    return this._setGaugeColor(2, _ColorManager_mpGaugeColor1);
  };

  const _ColorManager_mpGaugeColor2 = ColorManager.mpGaugeColor2;
  ColorManager.mpGaugeColor2 = function() {
    return this._setGaugeColor(3, _ColorManager_mpGaugeColor2);
  };

  const _ColorManager_tpGaugeColor1 = ColorManager.tpGaugeColor1;
  ColorManager.tpGaugeColor1 = function() {
    return this._setGaugeColor(4, _ColorManager_tpGaugeColor1);
  };

  const _ColorManager_tpGaugeColor2 = ColorManager.tpGaugeColor2;
  ColorManager.tpGaugeColor2 = function() {
    return this._setGaugeColor(5, _ColorManager_tpGaugeColor2);
  };

})();
