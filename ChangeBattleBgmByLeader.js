//=============================================================================
// Plugin for RPG Maker MZ
// ChangeBattleBgmByLeader.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Change the normal battle bgm according to the top actor
 * @author Sasuke KANNAZUKI
 *
 * @param Invalid Switch
 * @desc When the switch is ON, this plugin doesn't work. It assumes battle against boss or special enemies.
 * @type switch
 * @default 1
 *
 * @command set
 * @text Set Bgm For Actors
 * @desc Set battle bgm when actorIds contain the leader
 *
 * @arg actorIds
 * @text Actors
 * @desc Actors for change bgm.
 * @type actor[]
 * @default []
 *
 * @arg bgm
 * @text Battle Bgm
 * @desc Battle Bgm For The Actor
 * @dir audio/bgm/
 * @type file
 * @default 
 *
 * @arg volume
 * @parent bgm
 * @text Volume
 * @desc Volume of the BGM,
 * @type number
 * @max 10000
 * @min 0
 * @default 90
 *
 * @arg pitch
 * @parent bgm
 * @text Pitch
 * @desc Pitch of the BGM,
 * @type number
 * @max 10000
 * @min 0
 * @default 100
 *
 * @arg pan
 * @parent bgm
 * @text Pan
 * @desc Pan of the BGM,
 * @type number
 * @max 100
 * @min -100
 * @default 0
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 * This plugin enables change battle bgm according to top actor.
 *
 * [Summary]
 * To validate this function, you must use Plugin Command.
 * If you need to ignore this setting (ex. boss, special enemies) 
 * set parameter.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc 戦闘BGMを先頭アクターによって変更できます
 * @author 神無月サスケ
 *
 * @param Invalid Switch
 * @text 無効化スイッチ
 * @desc このスイッチがONの間は、このプラグインは作用しません。ボス戦や特別な戦闘の場合を想定しています。
 * @type switch
 * @default 1
 *
 * @command set
 * @text バトルBGM設定
 * @desc アクター(複数設定可)が先頭の時のBGMをセットします
 *
 * @arg actorIds
 * @text アクターID(複数指定可)
 * @desc 指定されたアクターが先頭の時、設定された戦闘BGMになります。
 * @type actor[]
 * @default []
 *
 * @arg bgm
 * @text 戦闘BGM
 * @desc 指定したアクター達が先頭の時のBGMです。
 * @dir audio/bgm/
 * @type file
 * @default 
 *
 * @arg volume
 * @parent bgm
 * @text ボリューム
 * @desc BGMの音量です。(デフォルト:90)
 * @type number
 * @max 10000
 * @min 0
 * @default 90
 *
 * @arg pitch
 * @parent bgm
 * @text ピッチ
 * @desc BGMの再生速度です。(デフォルト:100)
 * @type number
 * @max 10000
 * @min 0
 * @default 100
 *
 * @arg pan
 * @parent bgm
 * @text 位相
 * @desc マイナスにすると左側から、プラスにすると右側から曲が流れます
 * @type number
 * @max 100
 * @min -100
 * @default 0
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、先頭のアクターに応じて、戦闘BGMの変更を可能にします。
 *
 * ■概要
 * 設定はプラグインコマンドで行います。
 * もし、この機能を一時的に無効にしたい場合（例えばボス戦やイベント戦闘）、
 * パラメータで設定したスイッチをONにしてください。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'ChangeBattleBgmByLeader';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const invalidSwitchId = Number(parameters['Invalid Switch'] || 1);

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
    this.actorBgm = [];
  };

  //
  // process plugin commands
  //
  const bgmObj = args => {
    return {name:args.bgm, pan:+args.pan, pitch:+args.pitch, 
     volume:+args.volume};
  };

  PluginManager.registerCommand(pluginName, 'set', args => {
    let actorIds = eval(args.actorIds);
    actorIds = actorIds.map(id => +id);
    for (const actorId of actorIds) {
      $gameSystem.actorBgm[actorId] = bgmObj(args);
    }
  });

  //
  // determine bgm according to leader
  //
  const _Game_System_battleBgm = Game_System.prototype.battleBgm;
  Game_System.prototype.battleBgm = function() {
    const originalBgm = _Game_System_battleBgm.call(this);
    if (!$gameSwitches.value(invalidSwitchId)) {
      const leader = $gameParty.leader();
      const leaderId = leader ? leader.actorId() : 0;
      const bgm = $gameSystem.actorBgm[leaderId];
      if (bgm && leaderId) {
        return bgm;
      }
    }
    return originalBgm;
  };

})();
