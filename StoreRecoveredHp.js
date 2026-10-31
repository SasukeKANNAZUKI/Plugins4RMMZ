//=============================================================================
// Plugin for RPG Maker MZ
// StoreRecoveredHp.js
//=============================================================================
// [Update History]
// 2025.Jan.16 Ver1.0.0 First Release
// 2025.Jan.17 Ver1.1.0 Let HP gain type selectable

/*:
 * @target MZ
 * @plugindesc Store Recovered HP and target actor on menu to specified variable
 * @author Sasuke KANNAZUKI
 *
 * @param Store Recovered HP
 * @desc Variable ID for store recovered HP.
 * @type variable
 * @default 15
 *
 * @param Recovering HP Type
 * @desc If Recover 50 to one whose MaxHP is 100 and Current HP is 80, Type1(Actual val):20 Type2(item effect):50
 * @type select
 * @option Type1(Actual value)
 * @value Type1
 * @option Type2(Item effect value)
 * @value Type2
 * @default Type1
 *
 * @param Store Recovered Actor
 * @desc Variable ID for store recovered actor ID. Set 0 to save nowhere.
 * @type variable
 * @default 16
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 *
 * This plugin saves recovered HP and actor to variables on menu.
 *
 * [Summary]
 * On menu, player uses item or skill to recover HP,
 * this plugin saves the effect value and target to specified variable.
 *
 * [Note]
 * - It always modify the value when someone is recovered on menu.
 *   If the item or skill for all, it stores only last actor's value.
 * - variables are reset to 0 either when one receive damage or
 *   recover on battle or map.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc メニューでのHP回復量を変数に保存
 * @author 神無月サスケ
 *
 * @param Store Recovered HP
 * @text 回復量格納変数
 * @desc 回復量を格納する変数IDです。
 * @type variable
 * @default 15
 *
 * @param Recovering HP Type
 * @text 回復量の求め方
 * @desc 現在HP80で最大HP100のキャラを50回復した場合……タイプ1(実際値)20, タイプ2(本来の回復値)50
 * @type select
 * @option タイプ1(実際値)
 * @value Type1
 * @option タイプ2(本来の回復値)
 * @value Type2
 * @default Type1
 *
 * @param Store Recovered Actor
 * @text 回復アクター格納変数
 * @desc 回復したアクターのIDを格納する変数IDです。0にすると格納しません。
 * @type variable
 * @default 16
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * ■概要
 * このプラグインは、メニューでHPが回復された際の回復量と
 * 回復を受けたアクターのIDを、オプションで指定した変数に格納します。
 *
 * ■注意
 * - 保存されるのは、最後に回復を受けたアクターと回復量です。
 *   全体回復の場合、最後のアクターの値のみ格納されます。
 * - 保存対象は、メニューから回復された時のみです。
 *   HPダメージを受けた時や、マップ上でのイベントでの回復や、
 *   戦闘時などは、値が0にリセットされます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'StoreRecoveredHp';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const varId = Number(parameters['Store Recovered HP'] || 15);
  const targetId = Number(parameters['Store Recovered Actor'] || 16);
  const recoverType = parameters["Recovering HP Type"] || "Type1";

  const atMenu = () => {
    const currentScene = SceneManager._scene.constructor.name;
    return !["Scene_Map", "Scene_Battle"].includes(currentScene);
  };

  const _Game_Actor_gainHp = Game_Actor.prototype.gainHp;
  Game_Actor.prototype.gainHp = function(value) {
    if (varId) {
        $gameVariables.setValue(varId, 0);
    }
    if (targetId) {
        $gameVariables.setValue(targetId, 0);
    }
    if (atMenu) {
      if (value > 0 && varId) {  
        const realValue = recoverType === "Type1" ?
          Math.min(value, this.mhp - this.hp) : value;
        $gameVariables.setValue(varId, realValue);
      }
      if(value > 0 && targetId) {
         $gameVariables.setValue(targetId, this.actorId());
      }
    }
    _Game_Actor_gainHp.call(this, value);
  };
})();
