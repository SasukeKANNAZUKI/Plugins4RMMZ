//=============================================================================
// SpecialExhaustSkill.js (Ver 1.5.0)
//=============================================================================
// Ver1.0.0 2017/Jun/26 first release
// Ver1.1.0 2017/Jun/26 add the option to exclude these skills from auto.
// Ver1.2.0 2017/Aug/01 add skillSpType 'exhaustHpMp'.
// Ver1.3.0 2019/Jun/30 fix bug when enemy use exhaustHP, it doesn't vanish
// Ver1.4.0 2021/Sep/08 Available also RPG Maker MZ
// Ver1.4.1 2021/Sep/12 add option: exhaustMP's display cost type
// Ver1.4.2 2021/Dec/26 Fix bug: invoke error when actors fail to escape
// Ver1.5.0 2025/Jul/18 Displays also TP to consume

/*:
 * @target MV MZ
 * @plugindesc [Ver1.5.0]Enables to Make Skill that Exhausts HP and/or MP.
 * @author Sasuke KANNAZUKI
 *
 * @param After HP Exhausted Log
 * @desc %1 is replaced to subject name. If empty string, no display.
 * @default %1 exhausted all physical energy...
 * @type string
 *
 * @param After MP Exhausted Log
 * @desc %1 is replaced to subject name. If empty string, no display.
 * @default %1 exhausted all mental power...
 * @type string
 *
 * @param Include to default AI
 * @desc Whether to include these skills to default AI candidate.
 * (0=exclude, 1=include MP skill, 2=include HP skill, 3=include)
 * @option exclude both
 * @value 0
 * @option include MP skill
 * @value 1
 * @option include HP skill
 * @value 2
 * @option include both
 * @value 3
 * @default 0
 * @type select
 *
 * @param Display MP At Exhausts
 * @desc Displaying MP cost when it's MP Exhausting Skill
 * @option Hide Cost
 * @value none
 * @option Specified String
 * @value string
 * @option Current MP
 * @value value
 * @default none
 * @type select
 *
 * @param Text For MP Exhaust Cost
 * @parent Display MP At Exhausts
 * @desc Cost Text when you select 'Specified String'
 * @default ALL
 * @type text
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV(Ver1.6.0 or later) and MZ.
 *
 * This plugin enables to make skill whose cost is all MP or HP.
 *
 * [Summary]
 * write down item or skill's note following notation:
 * <skillSpType:exhaustHp>
 *  after executing the skill, subject will die.
 * <skillSpType:exhaustMp>
 *  after executing the skill, subject's mp will be 0.
 * <skillSpType:exhaustHpMp>
 *  both above 2 effect
 *
 * [Useful usage sample]
 * These skills are so risky, so much effect is expected by the user.
 * - set "Certain Hit', and 100% success.
 * - the range is "all enemies".
 * - Recommended damage formula:
 *  - for HP exhaust skill: a.hp * 4.5
 *  : if you want to sweep all enemies: b.hp, and variance is 0%.
 *  - for MP exhaust skill: (a.mp + 1) * 2.5
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc [Ver1.5.0]全てのHPまたはMPを消費するスキルを作成可能に
 * @author 神無月サスケ
 *
 * @param After HP Exhausted Log
 * @text HP全消費時の表示文字列
 * @desc 全HP技使用後の表示です。%1は使用者名に置き換わります。
 * 空文字を指定すると表示しません。
 * @default %1は力尽きて倒れた。
 * @type string
 *
 * @param After MP Exhausted Log
 * @text MP全消費時の表示文字列
 * @desc 全MP技使用後の表示です。%1は使用者名に置き換わります。
 * 空文字を指定すると表示しません。
 * @default %1は魔力を使い果たした。
 * @type string
 *
 * @param Include to default AI
 * @text 自動戦闘でも使用？
 * @desc これらの技を、デフォルトの自動戦闘AIの候補に含めるか。
 * (0=含めない, 1=MP技のみ, 2=HP技のみ, 3=両方含める)
 * @option 含めない
 * @value 0
 * @option MP技のみ
 * @value 1
 * @option HP技のみ
 * @value 2
 * @option 両方含める
 * @value 3
 * @default 0
 * @type select
 *
 * @param Display MP At Exhausts
 * @text 全MP使用技の消費MP表示
 * @desc 非表示、文字列、MPコストから選択します。
 * @option 非表示
 * @value none
 * @option 特定の文字列
 * @value string
 * @option 現在のMP
 * @value value
 * @default none
 * @type select
 *
 * @param Text For MP Exhaust Cost
 * @parent Display MP At Exhausts
 * @text 『特定の文字列』選択時の文字列
 * @desc 他を選んだ場合無視されます。
 * @default ALL
 * @type text
 *
 * @help
 * このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 *
 * このプラグインは、使用者の全てのHPやMPを消費するスキルを作成可能にします。
 *
 * ■概要
 * スキルまたはアイテムのメモに以下のように書いてください。
 * <skillSpType:exhaustHp>
 *  この記述がある場合、使用者が使用後に戦闘不能になります。
 * <skillSpType:exhaustMp>
 *  この記述がある場合、使用者のMPが使用後に0になります。
 * <skillSpType:exhaustHpMp>
 *  上記ふたつの効果が同時に現れます。
 *
 * ■有益な設定方法
 * このようなリスクの高い技には、強力な効果が求められます。
 * いくつか、設定のヒントを設けます。
 *
 * ・タイプは「必中」にしましょう。
 * ・範囲は「敵全体」、使用可能時は「バトル画面」にしましょう。
 * ・成功率は100％が望ましいです。
 * ・ダメージは「HPダメージ」で、MP全消費技の場合、『(a.mp + 1) * 2.5』、
 *   HP全消費技の場合、『a.hp * 4.5』あたりが、経験則上、丁度いいようです。
 *   全ての敵を即座に倒したい場合、式を『b.hp』、分散度を0%にしましょう。
 *
 * ・HP消費技のメッセージの例：
 *  %1は自らの身体を爆発させた！
 *  強烈な熱波や衝撃波が巻き起こる！
 *
 * ・MP消費技のメッセージの例：
 *  %1は%2を放った！
 *  暴走する魔力が敵を襲う！
 *
 * アニメーションも工夫して、派手なものを選択すると、より雰囲気が増します。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'SpecialExhaustSkill';

  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const hpExhaustedLog = parameters['After HP Exhausted Log'] || '';
  const mpExhaustedLog = parameters['After MP Exhausted Log'] || '';
  const doIncludeSkills = Number(parameters['Include to default AI'] || 0);
  const doesIncludeMpExhaust = !!(doIncludeSkills & 0x01);
  const doesIncludeHpExhaust = !!(doIncludeSkills & 0x02);
  const drawTypeOfMpExhaust = parameters['Display MP At Exhausts'] || 'none';
  const drawTextOfMpExhaust = parameters['Text For MP Exhaust Cost'] || 'ALL';

  //
  // check if it's exhaust skill
  //
  const isHpExhaustSkill = skill => {
    return skill.meta.skillSpType === 'exhaustHp' ||
     skill.meta.skillSpType === 'exhaustHpMp';
  };

  const isMpExhaustSkill = skill => {
    return skill.meta.skillSpType === 'exhaustMp' ||
     skill.meta.skillSpType === 'exhaustHpMp';
  };

  // main routine
  //
  const _BattleManager_endAction = BattleManager.endAction;
  BattleManager.endAction = function() {
    if (this._action) {
      if (this._action.processExhaustMP() && mpExhaustedLog) {
        this._logWindow.push('addText', mpExhaustedLog.format(
         this._subject.name()));
      }
      if (this._action.processExhaustHP() && hpExhaustedLog) {
        this._logWindow.push('addText', hpExhaustedLog.format(
          this._subject.name())
        );
      }
    }
    _BattleManager_endAction.call(this);
  };

  Game_Action.prototype.processExhaustHP = function () {
    if (isHpExhaustSkill(this.item())) {
      this.subject().clearActions();
      this.subject().addNewState(this.subject().deathStateId());
      this.subject().performCollapse();
      return true;
    }
    return false;
  };

  Game_Action.prototype.processExhaustMP = function () {
    if (isMpExhaustSkill(this.item())) {
      this.subject()._mp = 0;
      return true;
    }
    return false;
  };

  //
  // When subject's MP is 0, it cannot use ExhausutMP skill.
  //
  const _Game_BattlerBase_meetsSkillConditions =
   Game_BattlerBase.prototype.meetsSkillConditions;
  Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    if (!_Game_BattlerBase_meetsSkillConditions.call(this, skill)) {
      return false;
    }
    if (this._mp === 0 && isMpExhaustSkill(skill)) {
      return false;
    }
    return true;
  };

  //
  // exclude(or include) these skills to default AI candidate
  //
  const _Game_Actor_makeActionList = Game_Actor.prototype.makeActionList;
  Game_Actor.prototype.makeActionList = function() {
    let list = _Game_Actor_makeActionList.call(this);
    return list.filter(skill => {
      if (!doesIncludeHpExhaust && isHpExhaustSkill(skill.item())) {
        return false;
      } else if (!doesIncludeMpExhaust && isMpExhaustSkill(skill.item())) {
        return false;
      }
      return true;
    });
  };

  //
  // draw MP cost of MP exhaust skill
  //
  const drawExhaustTpCost = (_window, skill, x, y, width) => {
    if (_window._actor.skillTpCost(skill) > 0) {
      const c = 'ColorManager' in window ? ColorManager : this;
      _window.changeTextColor(c.tpCostColor());
      const tpCost = _window._actor.skillTpCost(skill);
      _window.drawText(tpCost, x, y, width, "right");
      return _window.textWidth(" " + tpCost);
    }
    return 0;
  };

  const drawExhaustMpCost = (_window, skill, x, y, width, offset) => {
    const c = 'ColorManager' in window ? ColorManager : _window;
    _window.changeTextColor(c.mpCostColor());
    switch (drawTypeOfMpExhaust) {
    case 'value':
      _window.drawText(_window._actor.mp, x, y, width - offset, "right");
      break;
    case 'string':
      _window.drawText(drawTextOfMpExhaust, x, y, width - offset, "right");
      break;
    case 'none':
    default:
      // don't draw anything
    }
  };

  const _Window_SkillList_drawSkillCost =
   Window_SkillList.prototype.drawSkillCost;
  Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
    if (isMpExhaustSkill(skill)) {
      const offset = drawExhaustTpCost(this, skill, x, y, width);
      drawExhaustMpCost(this, skill, x, y, width, offset);
      return;
    }
    _Window_SkillList_drawSkillCost.call(this, skill, x, y, width);
  };

})();
