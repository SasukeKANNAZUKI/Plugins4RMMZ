//=============================================================================
// Plugin for RPG Maker MZ
// EnemyCallsAlly.js
//=============================================================================
// [Update History]
// 2021.Feb.11 Ver1.0.0 First Release
// 2021.Feb.12 Ver1.1.0 Change message when ally call fails.
//  - Fix bug that called enemy displays wrong priority.
//  - Add plugin command that changes position for new enemies
// 2021.Dec.07 Ver1.1.1 Accept minus value at setting position
// 2024.Jan.05 Ver1.2.0 
//  - Enables animation display to newly appeared enemy.
//  - Enables to change the number of max extra enemy(default and max: 4)
//  - Change spec of plugin command: Setting is reset when battle terminates.
//  - Enables to change the callee enemy's position by setting enemy's note
//    who is in the troop.

/*:
 * @target MZ
 * @plugindesc [Ver1.2.0]Enales to make skill that an enemy call new ally.
 * @author Sasuke KANNAZUKI
 *
 * @param maxExtraEnemy
 * @text Max Extra Enemy Number
 * @desc Set between 0 and 4.
 * @type number
 * @max 4
 * @min 0
 * @default 4
 *
 * @param NewAxis
 * @text [Axes for Called Enemy]
 * @desc Set axes for called enemy.
 * @type string
 * @default 
 *
 * @param param1X
 * @parent NewAxis
 * @text X of new enemy 1
 * @desc Default:102
 * @type number
 * @max 9999
 * @min -9999
 * @default 102
 *
 * @param param1Y
 * @parent NewAxis
 * @text Y of new enemy 1
 * @desc Default:316
 * @type number
 * @min -9999
 * @default 316
 *
 * @param param2X
 * @parent NewAxis
 * @text X of new enemy 2
 * @desc Default:242
 * @type number
 * @min -9999
 * @default 242
 *
 * @param param2Y
 * @parent NewAxis
 * @text Y of new enemy 2
 * @desc Default:316
 * @type number
 * @min -9999
 * @default 316
 *
 * @param param3X
 * @parent NewAxis
 * @text X of new enemy 3
 * @desc Default:401
 * @type number
 * @min -9999
 * @default 401
 *
 * @param param3Y
 * @parent NewAxis
 * @text Y of new enemy 3
 * @desc Default:316
 * @type number
 * @min -9999
 * @default 316
 *
 * @param param4X
 * @parent NewAxis
 * @text X of new enemy 4
 * @desc Default:547
 * @type number
 * @min -9999
 * @default 547
 *
 * @param param4Y
 * @parent NewAxis
 * @text Y of new enemy 4
 * @desc Default:316
 * @type number
 * @min -9999
 * @default 316
 *
 * @param strings
 * @text [Messages]
 * @desc Messages to result of ally call
 * @type string
 * @default 
 *
 * @param callSuccess
 * @parent strings
 * @text Success Message
 * @desc Message when ally call successes
 * @type string
 * @default %1 comes and join the troop!
 *
 * @param callFailure
 * @parent strings
 * @text Failure Message
 * @desc Message when one failed to call ally
 * @type string
 * @default But no one comes...
 *
 * @command changeAxis
 * @text Change Coord
 * @desc Change Coord for a new enemy. It resets when the battle is terminated.
 *
 * @arg positionId
 * @text Position ID
 * @desc ID of Target New Enemy Position. Be 1,2,3 or 4.
 * @type number
 * @max 4
 * @min 1
 * @default 1
 *
 * @arg X
 * @text X axis
 * @desc X of new position
 * @type number
 * @max 9999
 * @min -9999
 * @default 280
 *
 * @arg Y
 * @text Y axis
 * @desc Y of new position
 * @type number
 * @max 9999
 * @min -9999
 * @default 320
 *
 * @param animationId
 * @text Attending Anime Id
 * @desc animation id for new enemy appears. Set 0 to no animations.
 * @type animation
 * @default 0
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 *
 * This plugin enables enemy to call ally.
 *
 * [Summary]
 * When it writes a skill's note <callAlly>, and the skill become enemy call.
 * Be sure that the skill must for enemies, not for actors.
 *
 * Then, set an enemy's note.
 * <callAlly:1,3>
 * By writing above, the enemy calls ally whose ID is either 1 or 3.
 * <callAlly>
 * If it omits parameter, it calls the same enemy as caller.
 *
 * You can set success percentage as following notation:
 * <callAllyRate:50>
 * Write at enemies note like above. In this case success rate is 50%.
 * If it omita this parameter, success rate become 100%.
 *
 * [[NOTE]]
 * If it needs to write callee enemy IDs notation like <callAlly:1,3>,
 * it must be written at the ENEMY's note.
 * It DOESN'T work when it's written the notation above to a SKILL's note.
 * It also applies to notation like <callAllyRate:50>.
 *
 * [Plugin Command]
 * - Change the coordinates of new enemies temporarily during the battle
 *
 * [Note]
 * - Since this plugin deal with enemies, actor's notations are invalid.
 * - Max number of enemies is the sum of original enemy's number and
 *   the value set in the plugin parameters (default:4).
 * - Enemy's X position is the center of the enemy.
 * - Since enemy's Y position is bottom of the enemy, if the value < 0,
 *   the enemy doesn't appear.
 *
 * [Advanced Option] Special Setting for a Troop (Since Ver1.2.0)
 * It's able to set special setting for each troop if you need.
 * To set it, write following to an enemy's note that belongs to the troop.
 *
 * [[Change Max Number of Extra Enemy]]
 *
 * <ExtraEnemyMax:[number]>
 * [number] must be interget between 0 and 4.
 *
 * Ex.
 * <ExtraEnemyMax:4>
 *   The max number of enemies in the troop becomes
 *   the sum of 4 and original enemies.
 * <ExtraEnemyMax:0>
 *   The max number of enemies is no more than that of original enemies.
 *
 * [[Change The Place of Extra Enemies]]
 *
 * <ExtraEnemyCoord1:[Xcoord],[Ycoord]>
 * <ExtraEnemyCoord2:[Xcoord],[Ycoord]>
 * <ExtraEnemyCoord3:[Xcoord],[Ycoord]>
 * <ExtraEnemyCoord4:[Xcoord],[Ycoord]>
 * Set the coordinate of extra enemies to ([Xcoord], [Ycoord]).
 * Be sure that [Xcoord] is the center of the enemy,
 * and [Ycoord] is the bottom of one.
 *
 * Ex.
 * <ExtraEnemyCoord2:100,350>
 *   Set the position of second extra enemy be (100,350).
 * <ExtraEnemyCoord4: 700, 200>
 *   Set the position of 4th extra enemy be (700,200).
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc [Ver1.2.0]敵キャラが「仲間を呼ぶ」スキルの作成
 * @author 神無月サスケ
 *
 * @param maxExtraEnemy
 * @text 最大追加数
 * @desc 通常以外に追加される敵キャラ数。最大数4。
 * @type number
 * @max 4
 * @min 0
 * @default 4
 *
 * @param NewAxis
 * @text [呼ばれた敵の座標]
 * @desc 敵グループに戦闘不能がいない場合の座標
 * @type string
 * @default 
 *
 * @param param1X
 * @parent NewAxis
 * @text 呼ばれた敵1のX座標
 * @desc デフォルト 102
 * @type number
 * @max 9999
 * @min -9999
 * @default 102
 *
 * @param param1Y
 * @parent NewAxis
 * @text 呼ばれた敵1のY座標
 * @desc デフォルト 316
 * @type number
 * @min -9999
 * @default 316
 *
 * @param param2X
 * @parent NewAxis
 * @text 呼ばれた敵2のX座標
 * @desc デフォルト 242
 * @type number
 * @min -9999
 * @default 242
 *
 * @param param2Y
 * @parent NewAxis
 * @text 呼ばれた敵2のY座標
 * @desc デフォルト 316
 * @type number
 * @min -9999
 * @default 316
 *
 * @param param3X
 * @parent NewAxis
 * @text 呼ばれた敵3のX座標
 * @desc デフォルト 401
 * @type number
 * @min -9999
 * @default 401
 *
 * @param param3Y
 * @parent NewAxis
 * @text 呼ばれた敵3のY座標
 * @desc デフォルト 316
 * @type number
 * @min -9999
 * @default 316
 *
 * @param param4X
 * @parent NewAxis
 * @text 呼ばれた敵4のX座標
 * @desc デフォルト 547
 * @type number
 * @min -9999
 * @default 527
 *
 * @param param4Y
 * @parent NewAxis
 * @text 呼ばれた敵4のY座標
 * @desc デフォルト 316
 * @type number
 * @min -9999
 * @default 316
 *
 * @param strings
 * @text [文字列]
 * @desc 敵が仲間を呼んだ時の結果
 * @type string
 * @default 
 *
 * @param callSuccess
 * @parent strings
 * @text 成功メッセージ
 * @desc 仲間が現れた時に表示する文
 * @type string
 * @default %1が来て敵グループに加わった！!
 *
 * @param callFailure
 * @parent strings
 * @text 失敗メッセージ
 * @desc 仲間が来なかった時に表示する文
 * @type string
 * @default しかし誰も現れなかった...
 *
 * @command changeAxis
 * @text 座標変更
 * @desc 新しく呼ばれる敵の座標を変更します。戦闘が終了するとリセットされます。
 *
 * @arg positionId
 * @text ポジションID
 * @desc 1～4のうち、どの敵の座標を変更するか
 * @type number
 * @max 4
 * @min 1
 * @default 1
 *
 * @arg X
 * @text X座標
 * @desc 更新後のX座標です
 * @type number
 * @max 9999
 * @min -9999
 * @default 280
 *
 * @arg Y
 * @text Y座標
 * @desc 更新後のY座標です
 * @type number
 * @max 9999
 * @min -9999
 * @default 320
 *
 * @param animationId
 * @text 登場時アニメーション
 * @desc 呼ばれた敵の登場時に再生するアニメです。0を指定すると再生されません。
 * @type animation
 * @default 0
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、敵に「仲間を呼ぶ」スキルを設定可能にします。
 *
 * ■設定方法
 * スキルのメモ欄に <callAlly> と記述すると、
 * そのスキルは（敵が）仲間を呼ぶスキルとみなされます。
 *
 * 敵のメモ欄で、呼び出す敵の種類や、成功確率を設定できます。
 * <callAlly:1,3>
 * とした場合、ID1かID3の敵キャラを呼び出します。
 * <callAlly>
 * とだけ書いたときは、自分と同じ種族の敵を呼び出します。
 *
 * 成功率を設定するには、敵のメモ欄に以下のように書きます。
 * <callAllyRate:50>
 * 上記の場合、成功率は50%になります。省略した場合は100％になります。
 *
 * ◆注意：<callAlly:1,3> のような、呼び出す敵キャラIDの設定は、
 * 敵キャラのメモでのみ有効です。スキルのメモに書いても無効です。
 * <callAllyRate:50> についても同様に、敵キャラのメモに書いて下さい。
 *
 * ■プラグインコマンド
 * - 呼ばれる敵1～4の位置座標を変更できます。戦闘が終了するとリセットされます。
 *
 * ■注意
 * - 一度に登場する敵キャラの最大値は、通常の敵キャラ数と
 *  プラグインパラメータで指定された数(デフォルト:4)の合計になります。
 *  それ以上呼び出そうとしても必ず失敗します。
 * - 指定するX座標は、敵キャラ画像の中央です。
 * - 指定するY座標は、敵キャラ画像の足下です。よって例えば0未満にした場合、
 *  その敵キャラは画面外となり表示されません。
 *
 * このプラグインが有効なのは敵キャラのみで、アクターに設定しても
 * 単に無視されます。
 *
 * ■追加機能：敵グループ単位での設定(Ver1.2.0～)
 * 特定の敵グループで、呼び出した敵キャラの座標と、最大呼び出し数を個別に
 * 設定可能です。
 * 設定するには、その敵グループに最初からいる敵キャラのいずれかのメモに、
 * 以下の記述をします。
 *
 * ◆最大追加数の変更
 * <ExtraEnemyMax:[個別敵キャラ数]>
 * [個別敵キャラ数] : 0～4で指定します。
 *
 * 例：
 * <ExtraEnemyMax:4>
 * 最初に設定された敵キャラよりも、最大で４体多い敵キャラが呼び出し可能です。
 * <ExtraEnemyMax:0>
 * 最初に設定された敵キャラ数以上は、呼び出されません。
 *
 * ◆各追加敵キャラの座標変更
 * <ExtraEnemyCoord1:[X座標],[Y座標]>
 * <ExtraEnemyCoord2:[X座標],[Y座標]>
 * <ExtraEnemyCoord3:[X座標],[Y座標]>
 * <ExtraEnemyCoord4:[X座標],[Y座標]>
 * 追加敵キャラ1～4の座標を、特定の座標に設定します。
 * [X座標]は敵キャラの中心座標、[Y座標]は敵キャラの足元の座標を指定します。
 *
 * 例：
 * <ExtraEnemyCoord2:100,350>
 * 2番目の追加敵キャラの座標を(100,350)にします。
 * <ExtraEnemyCoord4: 700, 200>
 * 4番目の追加敵キャラの座標を(700,200)にします。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'EnemyCallsAlly';
  //
  // process parameters and initialize variables and functions
  //
  const parameters = PluginManager.parameters(pluginName);
  const param1X = +(parameters['param1X'] || 102);
  const param1Y = +(parameters['param1Y'] || 316);
  const param2X = +(parameters['param2X'] || 242);
  const param2Y = +(parameters['param2Y'] || 316);
  const param3X = +(parameters['param3X'] || 401);
  const param3Y = +(parameters['param3Y'] || 316);
  const param4X = +(parameters['param4X'] || 547);
  const param4Y = +(parameters['param4Y'] || 316);
  const callSuccess = parameters['callSuccess'] || '%1 appears!';
  const callFailure = parameters['callFailure'] || 'But no one comes...';
  const animationId = Number(parameters['animationId'] || 0);

  let extraXpos;
  let extraYpos;
  let maxExtraEnemy;

  const resetExtraPosition = () => {
    extraXpos = [param1X, param2X, param3X, param4X];
    extraYpos = [param1Y, param2Y, param3Y, param4Y];
    maxExtraEnemy = Number(parameters['maxExtraEnemy'] || 4);
  };

  resetExtraPosition();

  const normalXpos = () => $gameTroop.troop().members.map(enemy => enemy.x);
  const normalYpos = () => $gameTroop.troop().members.map(enemy => enemy.y);

  //
  // process plugin command
  //
  PluginManager.registerCommand(pluginName, 'changeAxis', args => {
    const id = +args.positionId;
    extraXpos[id - 1] = +args.X;
    extraYpos[id - 1] = +args.Y;
  });

  //
  // process the note of troop
  //
  const _Game_Troop_setup = Game_Troop.prototype.setup;
  Game_Troop.prototype.setup = function(troopId) {
    _Game_Troop_setup.call(this, troopId);
    processTroopNote();
  };

  const processTroopNote = () => {
    for (enemy of $gameTroop.members()) {
      processEnemyNote(enemy.enemy());
    }
  };

  const coordReg = /^\s*([0-9]+)\s*\,\s*([0-9]+)\s*$/;

  const processEnemyNote = enemy => {
    maxExtraEnemy = +enemy.meta.ExtraEnemyMax || maxExtraEnemy;
    for (let i = 1; i <= 4; i++) {
      const tagValue = enemy.meta["ExtraEnemyCoord" + i];
      if (tagValue) {
        const res = coordReg.exec(tagValue);
        if (res) {
          extraXpos[i - 1] = parseInt(res[1]);
          extraYpos[i - 1] = parseInt(res[2]);
        }
      }
    }
  };

  //
  // initialze occupied information
  //
  const _BattleManager_setup = BattleManager.setup;
  BattleManager.setup = function(troopId, canEscape, canLose) {
    _BattleManager_setup.call(this, troopId, canEscape, canLose);
    this.numEnemies = $gameTroop.members().length;
    this.occupied = initializeOccupied();
  };

  const initializeOccupied = () => {
    let occupied = [];
    for (let i = 0; i < numEnemies(); i++) {
      occupied[i] = true;
      $gameTroop.members()[i].displayId = i;
    }
    for (let i = 0; i < maxExtraEnemy; i++) {
      occupied[i + numEnemies()] = false;
    }
    return occupied;
  };

  const numEnemies = () => BattleManager.numEnemies;
  const occupied = () => BattleManager.occupied;

  //
  // set callee enemy
  //
  Game_Enemy.prototype.calleeEnemyId = function() {
    let enemyId = 0;
    const callAlly = this.enemy().meta.callAlly;
    if (callAlly) {
      if (callAlly === true) {
        enemyId = this.enemyId();
      } else {
        const enemyIds = callAlly.split(",");
        enemyId = +enemyIds[Math.randomInt(enemyIds.length)];
      }
    } else {
      enemyId = this.enemyId();
    }
    return enemyId;
  };

  const _Game_Enemy_setHp = Game_Enemy.prototype.setHp;
  Game_Enemy.prototype.setHp = function(hp) {
    if (hp <= 0) {
      occupied()[this.displayId] = false;
    }
    _Game_Enemy_setHp.call(this, hp);
    
  };

  const _Game_Enemy_die = Game_Enemy.prototype.die;
  Game_Enemy.prototype.die = function() {
    occupied()[this.displayId] = false;
    _Game_Enemy_die.call(this);
  };

  const _Game_Enemy_revive = Game_Enemy.prototype.revive;
  Game_Enemy.prototype.revive = function() {
    occupied()[this.displayId] = true;
    _Game_Enemy_revive.call(this);
  };

  //
  // try to enemy call based on caller enemy
  //
  const findVacantDisplayId = () => occupied().indexOf(false);

  const doesCallAllySuccess = rate => {
    return rate == null ? true : Math.randomInt(100) < +rate;
  };

  Game_Enemy.prototype.tryToCallAlly = function () {
    const rate = this.enemy().meta.callAllyRate;
    if(doesCallAllySuccess(rate)) {
      return this.callNewEnemy();
    }
    return false;
  };

  Game_Enemy.prototype.callNewEnemy = function () {
    const enemyId = this.calleeEnemyId();
    const displayIndex = findVacantDisplayId();
    if (enemyId && displayIndex >= 0) {
      const newEnemy = new Game_Enemy(enemyId, 0, 0, true);
      $gameTroop._enemies.push(newEnemy);
      $gameTroop.makeUniqueNames();
      if (animationId > 0) {
        $gameTemp.requestAnimation([newEnemy], animationId);
      }
      return newEnemy;
    }
    return false;
  };

  const _Game_Enemy_initialize = Game_Enemy.prototype.initialize;
  Game_Enemy.prototype.initialize = function(enemyId, x, y, called = false) {
    if (called) {
      const displayIndex = findVacantDisplayId();
      this.displayId = displayIndex;
      x = this.screenX();
      y = this.screenY();
      occupied()[displayIndex] = true;
    }
    _Game_Enemy_initialize.call(this, enemyId, x, y);
    if (called) {
      $gameTroop.makeUniqueNames();
      if (BattleManager.isTpb()) {
        this.onBattleStart(false);
      }
    }
  };

  const _Game_Enemy_screenX = Game_Enemy.prototype.screenX;
  Game_Enemy.prototype.screenX = function() {
    if (this.displayId < numEnemies()) {
      return normalXpos()[this.displayId];
    }
    return extraXpos[this.displayId - numEnemies()];
  };

  const _Game_Enemy_screenY = Game_Enemy.prototype.screenY;
  Game_Enemy.prototype.screenY = function() {
    if (this.displayId < numEnemies()) {
      return normalYpos()[this.displayId];
    }
    return extraYpos[this.displayId - numEnemies()];
  };

  //
  // process skill data at first.
  //

  // 119 is a magic number with no reason.
  // If this number conflicts to another plugin,
  // simply change the number to solve the confliction.
  Game_Action.EFFECT_CALL_ALLY = 119;

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.call(this);
    processCallAllySkillData();
  };

  const processCallAllySkillData = () => {
    for (const skill of $dataSkills) {
      if (skill && skill.name && skill.meta.callAlly) {
        skill.effects.push({code:Game_Action.EFFECT_CALL_ALLY,
          dataId:0, value1:0, value2:0
        });
        // forcedly item scope changes subject.
        skill.scope = 11;
      } 
    }
  };

  //
  // set action for calling ally
  //
  const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
  Game_Action.prototype.applyItemEffect = function(target, effect) {
    switch (effect.code) {
    case Game_Action.EFFECT_CALL_ALLY:
      this.itemEffectCallAlly(target, effect);
      break;
    }
    _Game_Action_applyItemEffect.call(this, target, effect);
  };

  let calledAlly = [];

  Game_Action.prototype.itemEffectCallAlly = function(target, effect) {
    if (target.isEnemy()) {
      const newEnemy = target.tryToCallAlly();
      if (newEnemy) {
        this.makeSuccess(target);
        calledAlly[target.displayId] = newEnemy;
      } else {
        calledAlly[target.displayId] = false;
      }
    }
  };

  //
  // display enemy and its action message
  //
  Window_BattleLog.prototype.displayCallAlly = function(target) {
    const newEnemy = calledAlly[target.displayId];
    if (newEnemy) {
      this.push('addText', callSuccess.format(newEnemy.name()));
      SceneManager._scene._spriteset._refreshEnemies();
      calledAlly[target.displayId] = null;
      return true;
    } else if (newEnemy === false){
      this.push('addText', callFailure.format(target.name()));
      calledAlly[target.displayId] = null;
    } // assert newEnemy == null
    return false;
  };

  const _Window_BattleLog_displayFailure =
    Window_BattleLog.prototype.displayFailure;
  Window_BattleLog.prototype.displayFailure = function(target) {
    if (calledAlly[target.displayId] != null) { // the case ally call
      this.displayCallAlly(target);
    } else {
      _Window_BattleLog_displayFailure.call(this, target);
    }
  };

  Spriteset_Battle.prototype._refreshEnemies = function() {
    for (const sprite of this._enemySprites) {
      this._battleField.removeChild(sprite);
    }
    this.createEnemies();
  };

  //
  // reset extra position at the end of battle
  //
  const _BattleManager_endBattle = BattleManager.endBattle;
  BattleManager.endBattle = function(result) {
    _BattleManager_endBattle.call(this, result);
    resetExtraPosition();
  };

})();
