//=============================================================================
// Plugin for RPG Maker MV and MZ
// ExcludeAtOptimize.js
//=============================================================================
// [Update History]
// 2022.May.18 Ver1.0.0 First Release

/*:
 * @target MV MZ
 * @plugindesc Enables to make equipment that excludes from Optimize candidate
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV(Ver1.6.0 or later) ane MZ.
 * This plugin enables to make equipment that doesn't be selected at Optimize.
 *
 * [Summary]
 * Write weapon or armor's note <ExcludeFromAuto>.
 * Then the equipment won't be selected at 'Optimize'.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc 最強装備で選択されない装備を作成可能にします
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 * このプラグインは、最強装備で選択されない装備を作成可能にします。
 *
 * ■概要
 * 最強装備から除外したい武器や防具のメモに以下のように書いてください。
 * <ExcludeFromAuto>
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'ExcludeAtOptimize';

  const doesExcludeAtOptimize = equip => !!equip.meta.ExcludeFromAuto;

  const _Game_Actor_calcEquipItemPerformance =
   Game_Actor.prototype.calcEquipItemPerformance;
  Game_Actor.prototype.calcEquipItemPerformance = function(item) {
    if(doesExcludeAtOptimize(item)) {
      return -10000;
    }
    return _Game_Actor_calcEquipItemPerformance.call(this, item);
  };
})();
