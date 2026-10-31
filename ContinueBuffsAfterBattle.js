//=============================================================================
// Plugin for RPG Maker MV and MZ
// ContinueBuffsAfterBattle.js
//=============================================================================
// [Update History]
// 2024.Jul.26 Ver1.0.0 First Release

/*:
 * @target MV MZ
 * @plugindesc Enables to continue buff/debuff after the battle
 * @author Sasuke KANNAZUKI
 *
 * @param continueBuffId
 * @text Continue Buff Switch Id
 * @desc It works when the switch is true. Set 0 to always works.
 * @type switch
 * @default 0
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV(Ver1.6.0 or later) and MZ.
 *
 * [Summary]
 * This plugin enables to continue buff/debuff after the battle.
 * To work this plugin, specified switch is ON set at parameters.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc 戦闘終了後も、強化/弱体を持ち越すことが可能
 * @author 神無月サスケ
 *
 * @param continueBuffId
 * @text 有効化スイッチID
 * @desc このスイッチがONの時、有効になります。0を指定すると、常に有効です。
 * @type switch
 * @default 0
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 *
 * ■概要
 * このプラグインは、戦闘終了後も、強化/弱体を持ち越すことを可能にします。
 * この機能は、パラメータで指定されたスイッチIDがONの時に有効になります。
 * パラメータが0の場合、常に有効になります。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'ContinueBuffsAfterBattle';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const continueBuffId = Number(parameters['continueBuffId'] || 0);

  //
  // main routine
  //
  const shouldContinueBuff = actor => {
    if ($gameParty.inBattle() && !$gameParty.battleMembers().includes(actor)) {
      return false;
   }
   return !continueBuffId || $gameSwitches.value(continueBuffId);
  };

  const _Game_Actor_removeAllBuffs = Game_Battler.prototype.removeAllBuffs;
  Game_Battler.prototype.removeAllBuffs = function() {
    if (!shouldContinueBuff(this)) {
      _Game_Actor_removeAllBuffs.call(this);
    }
  };

})();
