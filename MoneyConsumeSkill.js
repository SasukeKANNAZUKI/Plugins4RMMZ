//=============================================================================
// MoneyConsumeSkill.js
//=============================================================================
// [History]
// 2017 Jul 21: 1.0.0 First Release
// 2017 Jul 26: 1.1.0 Bug Fix : non consumable item lost when short of money
// 2018 Apr 22: 1.1.1 Add % notation in the note
// 2021 Sep 15: 1.2.0 It is available also RPG Maker MZ.

/*:
 * @target MV MZ
 * @plugindesc [Ver1.2.0]Make the item or skill that consumes money
 * @author Sasuke KANNAZUKI
 *
 * @param TextColorId
 * @desc The color of consume money that defined img/system/Window.png
 * @type number
 * @min 1
 * @default 18
 *
 * @param doDisplayCurrency
 * @desc whether to display currency unit on the skill list. (1=yes, 0=no)
 * @type select
 * @option yes
 * @value 1
 * @option no
 * @value 0
 * @default 1
 *
 * @param Money For Battle Test
 * @desc If you don't have enough money, you cannot use the money consume item.
 * @type number
 * @min 0
 * @default 10000
 *
 * @help
 * This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV and MZ.
 *
 * [Summary]
 * This plugin enables to make skill/item that consumes money to use.
 * If you don't have enough money, you cannot use the skill/item.
 *
 * To make the skill/item, write down its note as follows:
 * <MoneyCost:100>
 * <MoneyCost:1000>
 *
 * [Note]
 * - Item window doesn't display money cost.
 *   so you may need to describe the cost in the descripton.
 * - In battle, it never displays party's money,
 *   so I recommend you to use message window to display currency sometimes.
 * 
 * [Advanced Option]
 * put % after the note of money cost, consume price is the ratio of party's
 * money.
 * <MoneyCost:20%>
 * <MoneyCost:50%>
 *
 * In the case, I recommend these damege formulae as HP damage:
 * $gameParty.gold() * 0.2
 * $gameParty.gold() * 0.5
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc [Ver1.2.0]お金を消費するスキルやアイテムが作成可能
 * @author 神無月サスケ
 *
 * @param TextColorId
 * @text コスト表示色
 * @desc お金消費スキルのコストを表示する際の色ID。
 * img/system/Window.png で定義された色のIDです。
 * @type number
 * @min 1
 * @default 18
 *
 * @param doDisplayCurrency
 * @text 通貨名表示？
 * @desc スキルの消費の欄に通貨名を付けるか。(1:つける, 0:つけない)
 * @type select
 * @option つける
 * @value 1
 * @option つけない
 * @value 0
 * @default 1
 *
 * @param Money For Battle Test
 * @text 戦闘テスト時所持金
 * @desc 戦闘テスト時の所持金。不足すると所持金消費アイテムが使えません。
 * @type number
 * @min 0
 * @default 10000
 *
 * @help
 * このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV および MZに対応しています。
 *
 * ■概要
 * 特定のスキルやアイテムの使用にお金を必要とすることが出来ます。
 * 所持金が足りない時は、そのスキルやアイテムは使えなくなります。
 *
 * スキルやアイテムのメモに、以下のように書いてください。
 * <MoneyCost:100>
 * <MoneyCost:1000>
 * 上記はそれぞれ、100G, 1000Gを必要とするスキルになります。
 *
 * ■注意
 * ・アイテム画面では必要金額が表示されません。説明の欄に消費額を書くことを
 *   おすすめします。
 * ・バトル画面では所持金が表示されないため、ターン毎に所持金を表示するなどの
 *   対策をおすすめします。
 * 
 * ■拡張機能
 * スキルやアイテムのメモに、以下のように%を付けると、
 * パーティーの所持金からの割合で所持金を消費します（端数切り上げ）。
 * <MoneyCost:20%>
 * <MoneyCost:50%>
 *
 * 消費する所持金に応じたダメージ式を作りたい方は、ダメージ計算式に
 * 以下のような式を推奨します。
 * $gameParty.gold() * 0.2
 * $gameParty.gold() * 0.5
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function() {
  //
  // process parameters
  //
  var parameters = PluginManager.parameters('MoneyConsumeSkill');
  var TextColorId = Number(parameters['TextColorId'] || 18);
  var doDisplayCurrency = !!Number(parameters['doDisplayCurrency'] || 1);
  var moneyForBtlTest = Number(parameters['Money For Battle Test'] || 10000);

  //
  // for efficiency, process note at first.
  //
  var _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.call(this);
    DataManager.processMoneyCost();
  };

  DataManager.processMoneyCost = function() {
    var re = /([0-9]+)(\%?)/;
    for (var i = 1; i < $dataSkills.length; i++) {
      var skill = $dataSkills[i];
      if (skill.meta.MoneyCost) {
        var res = re.exec(skill.meta.MoneyCost);
        skill.moneyCost = Number(res[1]);
        skill.moneyRate = !!res[2];
      } else {
        skill.moneyCost = 0;
        skill.moneyRate = false;
      }
    }
    for (i = 1; i < $dataItems.length; i++) {
      var item = $dataItems[i];
      if (item.meta.MoneyCost) {
        var res = re.exec(item.meta.MoneyCost);
        item.moneyCost = Number(res[1]);
        item.moneyRate = !!res[2];
      } else {
        item.moneyCost = 0;
        item.moneyRate = false;
      }
    }
  };

  //
  // for battle test, get enough money to use the item.
  //
  var _Game_Party_setupBattleTestItems =
   Game_Party.prototype.setupBattleTestItems;
  Game_Party.prototype.setupBattleTestItems = function() {
    $gameParty.gainGold(moneyForBtlTest);
    _Game_Party_setupBattleTestItems.call(this);
  };

  //
  // check if enough money to use skill/item
  //
  var moneyCost = function (item) {
    if (item.moneyRate) {
      return Math.ceil(item.moneyCost * $gameParty.gold() / 100.0);
    } else {
      return item.moneyCost
    }
  };

  var _Game_Actor_canPaySkillCost = Game_Actor.prototype.canPaySkillCost;
  Game_Actor.prototype.canPaySkillCost = function(skill) {
    if (moneyCost(skill) > $gameParty.gold()) {
      return false;
    } else if (skill.moneyCost > 0 && $gameParty.gold() === 0) {
      return false;
    }
    return _Game_Actor_canPaySkillCost.call(this, skill);
  };

  var _Game_Actor_meetsItemConditions =
   Game_Actor.prototype.meetsItemConditions;
  Game_Actor.prototype.meetsItemConditions = function(item) {
    if (moneyCost(item) > $gameParty.gold()) {
      return false;
    } else if (item.moneyCost > 0 && $gameParty.gold() === 0) {
      return false;
    }
    return _Game_Actor_meetsItemConditions.call(this, item);
  };

  //
  // pay the money cost of skill/item
  //
  var _Game_Actor_paySkillCost = Game_Actor.prototype.paySkillCost;
  Game_Actor.prototype.paySkillCost = function(skill) {
    $gameParty.loseGold(moneyCost(skill));
    _Game_Actor_paySkillCost.call(this, skill);
  };

  var _Game_Party_consumeItem = Game_Party.prototype.consumeItem
  Game_Party.prototype.consumeItem = function(item) {
    this.loseGold(moneyCost(item));
    _Game_Party_consumeItem.call(this, item);
  };

  //
  // draw the money cost of skill
  //
  var _Window_SkillList_drawSkillCost = 
   Window_SkillList.prototype.drawSkillCost;
  Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {

    if (skill.moneyCost > 0) {
      var c = 'ColorManager' in window ? ColorManager : this;
      this.changeTextColor(c.textColor(TextColorId));

      var text = String(moneyCost(skill));
      if (doDisplayCurrency) {
        text += TextManager.currencyUnit;
      }
      this.drawText(text, x, y, width, 'right');
    }
    _Window_SkillList_drawSkillCost.call(this, skill, x, y, width);
  };

  //
  // display money consume skill even if the money runs out
  //
  var _Window_BattleItem_includes = Window_BattleItem.prototype.includes;
  Window_BattleItem.prototype.includes = function(item) {
    var result = _Window_BattleItem_includes.call(this, item);
    if (!result) {
      result = $gameParty.members().some(function (actor) {
      return DataManager.isItem(item) &&
       _Game_Actor_meetsItemConditions.call(actor, item);
      });
    }
    return result;
  };
})();
