//=============================================================================
// Plugin for RPG Maker MZ
// StoreOutweighParam.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc HP/MP/TP回復時、最大値を超過した値を特定の変数に代入
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 * アクターのHP/MP/TPの回復時、最大値を超過した値を特定の変数に代入します。
 *
 * ■概要
 * ◆変数の指定
 * 対象アクターのメモに、以下のように記述して下さい。
 * <HpDiffVarId:11>  # 変数11番に、HP超過分を代入
 * <MpDiffVarId:12>  # 変数12番に、MP超過分を代入
 * <TpDiffVarId:13>  # 変数13番に、TP超過分を代入
 *
 * 常に全てを設定する必要はなく、例えばTP超過値が不要の場合、
 * 設定の必要はありません。
 *
 * ◆変数設定の仕様
 * ・HP/MP/TPが増加した際に、指定された変数に超過値が代入されます。
 * ・超過しなかった場合は、0 が代入されます。
 * ・値が変化しないパラメータには、代入は行われません。
 *   例えば、HPだけを回復した際、MPやTPの変数の値は変化しません。
 *
 * ◆変数設定のタイミング
 * ・戦闘中やメニューで、アイテムやスキルで回復/吸収が行われた時
 * ・戦闘中や移動中、自動回復(HP/MP/TP再生率が正の値の時)が行われた時
 * ・イベントコマンドHP/MP/TPの増減で、増加が行われた時
 *
 * ◆注意
 * 以下のタイミングでは、変数は更新されません。
 * ・イベントコマンド「全回復」を行った場合
 * ・プラグインで、回復ではなく、特定の値に設定が行われた場合
 * ・回復値の計算結果が0やマイナスになった場合
 *
 * ■補足
 * このプラグインは、以下の要望により作られたオーダーメイドです。
 * https://forum.tkool.jp/index.php?threads/6642/
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const _Game_Actor_gainHp = Game_Battler.prototype.gainHp;
  Game_Actor.prototype.gainHp = function(value) {
    if (value > 0) {
      const varId = +this.actor().meta.HpDiffVarId;
      if (varId) {
        const diff = Math.max(this.hp + value - this.mhp, 0);
        $gameVariables.setValue(varId, diff);
      }
    }
    _Game_Actor_gainHp.call(this, value);
  };

  const _Game_Actor_gainMp = Game_Battler.prototype.gainMp;
  Game_Actor.prototype.gainMp = function(value) {
    if (value > 0) {
      const varId = +this.actor().meta.MpDiffVarId;
      if (varId) {
        const diff = Math.max(this.mp + value - this.mmp, 0);
        $gameVariables.setValue(varId, diff);
      }
    }
    _Game_Actor_gainMp.call(this, value);
  };

  const _Game_Actor_gainTp = Game_Battler.prototype.gainTp;
  Game_Actor.prototype.gainTp = function(value) {
    if (value > 0) {
      const varId = +this.actor().meta.TpDiffVarId;
      if (varId) {
        const diff = Math.max(this.tp + value - this.maxTp(), 0);
        $gameVariables.setValue(varId, diff);
      }
    }
    _Game_Actor_gainTp.call(this, value);
  };
})();
