(function () {
  "use strict";

  var STORAGE_KEY = "strength-workouts-v1";
  var app = document.getElementById("app");
  var settingsPanel = document.getElementById("settings-panel");
  var settingsTrigger = document.getElementById("settings-trigger");
  var view = "home";
  var filter = "all";
  var settingsOpen = false;
  var lastSummary = null;

  var catalog = {
    "goblet-squat": {
      name: "Goblet squat", category: "Strength", equipment: "Dumbbell or kettlebell",
      sets: 3, reps: "8–10", rest: "60–90 s", tempo: "Controlled",
      focus: ["Quads", "Glutes", "Knee control"], visual: "squat",
      why: "Builds general lower-body strength for running, with a manageable load and a stable front-loaded position.",
      steps: ["Hold the weight close to your chest and stand with feet around shoulder-width apart.", "Brace gently and sit down between your hips, keeping the whole foot planted.", "Lower only as far as you can without hip pain or losing control.", "Push through the floor to stand tall; keep the weight close throughout."],
      cues: ["Let your knees follow the direction of your toes.", "Use a comfortable depth; load comes after control."],
      avoid: "Do not force a deep squat if it pinches the front or side of your hip.",
      easier: "Use bodyweight or squat to a higher bench."
    },
    "romanian-deadlift": {
      name: "Dumbbell Romanian deadlift", category: "Strength", equipment: "Dumbbells",
      sets: 3, reps: "8–10", rest: "60–90 s", tempo: "3 s down",
      focus: ["Hamstrings", "Glutes", "Posterior chain"], visual: "hinge",
      why: "Develops posterior-chain strength without needing repeated deep knee bends.",
      steps: ["Stand tall with dumbbells in front of your thighs and knees softly unlocked.", "Push your hips backwards while the weights slide close to your legs.", "Stop when you feel a hamstring stretch, before your back rounds or symptoms appear.", "Drive the floor away and bring your hips forward to stand."],
      cues: ["Think hips back, not weight down.", "Keep the weights close to your legs."],
      avoid: "Do not reach lower just to increase range. Stop if the movement provokes front-of-hip pain.",
      easier: "Use a lighter load and shorten the range, or use a banded good morning at home."
    },
    "step-down": {
      name: "Low step-down", category: "Control", equipment: "Low stable step",
      sets: 2, reps: "6–8 / leg", rest: "45–60 s", tempo: "3 s down",
      focus: ["Quadriceps", "Knee control", "Single-leg stability"], visual: "step",
      why: "Practises controlled single-leg lowering for stairs and running stance. Start low and make quality the priority.",
      steps: ["Stand near the edge of a stable 10–15 cm step, with one foot fully planted.", "Keep your pelvis level and slowly bend the supporting knee.", "Lower the free heel until it lightly taps the floor.", "Push through the working foot to return to the step, without bouncing."],
      cues: ["Keep the working knee tracking in line with your toes.", "Use a wall or rail for balance if necessary."],
      avoid: "Do not push through increasing knee or hip pain. A lower step is a valid progression.",
      easier: "Use a 5–10 cm step or practise a shallow supported single-leg squat."
    },
    "standing-calf": {
      name: "Standing calf raise", category: "Lower leg", equipment: "Bodyweight or dumbbells",
      sets: 2, reps: "12–15", rest: "45–60 s", tempo: "Pause at top",
      focus: ["Gastrocnemius", "Ankle stiffness"], visual: "calf",
      why: "Builds calf capacity for repeated push-off during running.",
      steps: ["Stand with the balls of your feet on the floor or a stable step, holding support if needed.", "Rise smoothly onto your toes.", "Pause briefly at the top, then lower under control through a comfortable range."],
      cues: ["Keep pressure even through the big toe and second toe.", "Use the same range on every repetition."],
      avoid: "Do not bounce or continue if shin pain increases.",
      easier: "Use two legs and hold a wall; progress to a loaded or single-leg variation only when comfortable."
    },
    "tibialis-raise": {
      name: "Tibialis raise", category: "Lower leg", equipment: "Wall or tibialis machine",
      sets: 2, reps: "15–25", rest: "30–45 s", tempo: "Controlled",
      focus: ["Front of shin", "Ankle control"], visual: "shin",
      why: "Strengthens the muscles that lift the front of the foot. It complements calf training rather than replacing it.",
      steps: ["Lean your back against a wall with your feet a short distance in front.", "Keep heels on the floor and lift your toes toward your shins.", "Pause briefly at the top, then lower slowly."],
      cues: ["Move at the ankle, not by leaning your body.", "Use a range that stays comfortable."],
      avoid: "Do not train through focal bone pain or worsening shin pain.",
      easier: "Stand closer to the wall and use fewer repetitions."
    },
    "hip-abduction-machine": {
      name: "Hip abduction machine", category: "Hip stability", equipment: "Hip abduction machine",
      sets: 2, reps: "12–15", rest: "45–60 s", tempo: "2 s out / 2 s in",
      focus: ["Gluteus medius", "Lateral hip"], visual: "abduction",
      why: "Trains the lateral hip muscles that help control the pelvis during single-leg stance.",
      steps: ["Sit with your back supported and your knees against the pads.", "Open your knees against the resistance without rocking your trunk.", "Pause briefly, then return slowly."],
      cues: ["Keep the pelvis still.", "Use a moderate load and smooth movement."],
      avoid: "If this causes pain at the outside of your hip, reduce the range or skip it and seek guidance if symptoms persist.",
      easier: "Use side-lying hip abduction or a light band at home."
    },
    "bench-row-gym": {
      name: "Dumbbell bench press + chest-supported row", category: "Upper body", equipment: "Dumbbells and bench",
      sets: 3, reps: "8–12 each", rest: "60 s after pair", tempo: "Controlled",
      focus: ["Chest", "Back", "Triceps", "Biceps"], visual: "upper",
      why: "A time-efficient push/pull superset for chest, upper back and arms.",
      steps: ["Bench press: lie on the bench, keep feet supported, lower dumbbells toward the sides of the chest, then press up.", "Chest-supported row: lie chest-down on an inclined bench, let arms hang, then pull elbows back without shrugging.", "Complete one set of each exercise, then rest and repeat."],
      cues: ["Keep wrists stacked over elbows on the press.", "Lead the row with your elbows; keep your neck relaxed."],
      avoid: "Do not arch excessively or use momentum to move the dumbbells.",
      easier: "Reduce the dumbbell load or use the chest-press and seated-row machines."
    },
    "face-pull-curl": {
      name: "Cable face pull + biceps curl", category: "Upper body", equipment: "Cable and rope / dumbbells",
      sets: 2, reps: "12–15 each", rest: "45 s after pair", tempo: "Controlled",
      focus: ["Rear shoulders", "Upper back", "Biceps"], visual: "upper",
      why: "Adds upper-back and arm work without using much time or leg fatigue.",
      steps: ["Face pull: set a rope around face height, pull toward your nose/forehead with elbows out, and finish with shoulders down.", "Biceps curl: keep elbows near your sides and curl without swinging your torso.", "Complete both movements before resting."],
      cues: ["Use a light, clean face-pull load.", "Keep your wrists neutral during curls."],
      avoid: "Avoid leaning backwards to finish a repetition.",
      easier: "Use a resistance band for face pulls and curls."
    },
    "triceps-pallof": {
      name: "Triceps press-down + Pallof press", category: "Core & arms", equipment: "Cable machine",
      sets: 2, reps: "10–15 / 10 each side", rest: "45 s after pair", tempo: "Controlled",
      focus: ["Triceps", "Anti-rotation core"], visual: "core",
      why: "Finishes the session with elbow-extension strength and trunk control.",
      steps: ["Press-down: keep elbows near your sides and straighten your arms without moving your shoulders.", "Pallof press: stand sideways to the cable, hold it at your chest, press straight forward and resist being rotated.", "Complete both arms work and both sides of the Pallof press."],
      cues: ["Stay tall and breathe normally.", "Keep hips and ribs stacked during the Pallof press."],
      avoid: "Choose a light enough Pallof load that your torso does not turn.",
      easier: "Use a resistance band anchored securely at chest height."
    },
    "leg-press": {
      name: "Leg press", category: "Strength", equipment: "Leg-press machine",
      sets: 3, reps: "8–12", rest: "60–90 s", tempo: "2–3 s down",
      focus: ["Quadriceps", "Glutes"], visual: "squat",
      why: "Allows you to load the quadriceps with support for the back and trunk.",
      steps: ["Set your feet about shoulder-width apart on the platform.", "Lower the platform only as far as you can while keeping your pelvis and lower back against the pad.", "Press through the whole foot and stop just short of forcefully locking the knees."],
      cues: ["Start light and use a consistent range.", "Keep knees tracking with toes."],
      avoid: "Do not let your pelvis tuck off the seat or use a deep range that pinches the hip.",
      easier: "Reduce the depth or use a lighter load."
    },
    "seated-leg-curl": {
      name: "Seated leg curl", category: "Strength", equipment: "Seated leg-curl machine",
      sets: 3, reps: "10–12", rest: "60 s", tempo: "2 s down",
      focus: ["Hamstrings"], visual: "hinge",
      why: "Strengthens the hamstrings with a controlled knee-flexion movement.",
      steps: ["Align the machine pivot with your knee and position the pad above your heels.", "Curl the pad down and back smoothly.", "Return slowly without letting the weight stack crash."],
      cues: ["Keep hips against the seat.", "Use the full comfortable range."],
      avoid: "Do not jerk or arch your back to move a heavy load.",
      easier: "Reduce the load."
    },
    "seated-calf": {
      name: "Seated calf raise", category: "Lower leg", equipment: "Seated calf-raise machine",
      sets: 3, reps: "12–20", rest: "45–60 s", tempo: "Pause at top",
      focus: ["Soleus", "Calf capacity"], visual: "calf",
      why: "Loads the calf with the knee bent, emphasising the soleus alongside straight-knee calf raises.",
      steps: ["Set the pads comfortably above your knees and place the balls of your feet on the platform.", "Raise your heels while keeping the forefoot planted.", "Pause, then lower with control."],
      cues: ["Use a smooth full range that is comfortable.", "Avoid bouncing at the bottom."],
      avoid: "Stop if the movement increases shin or Achilles pain.",
      easier: "Use bodyweight bent-knee calf raises while holding a wall."
    },
    "incline-pulldown": {
      name: "Incline dumbbell press + lat pulldown", category: "Upper body", equipment: "Bench, dumbbells and pulldown",
      sets: 3, reps: "8–12 each", rest: "60 s after pair", tempo: "Controlled",
      focus: ["Chest", "Lats", "Arms"], visual: "upper",
      why: "A balanced upper-body push/pull pairing.",
      steps: ["Incline press: set a low-to-moderate incline, lower dumbbells under control and press without bouncing.", "Lat pulldown: secure your thighs under the pads, pull the bar toward your upper chest, and return slowly.", "Complete both movements before resting."],
      cues: ["Keep shoulders comfortably down and back.", "Pull the bar in front of your head, not behind your neck."],
      avoid: "Avoid using a large backward lean during pulldowns.",
      easier: "Use lighter weights or selectorised machines."
    },
    "shoulder-arms": {
      name: "Supported shoulder press + arm superset", category: "Upper body", equipment: "Dumbbells and bench",
      sets: 2, reps: "8–12 press / 10–15 arms", rest: "45–60 s", tempo: "Controlled",
      focus: ["Shoulders", "Biceps", "Triceps"], visual: "upper",
      why: "Adds shoulder and arm strength while keeping the torso supported.",
      steps: ["Shoulder press: sit with back support, start dumbbells around shoulder height, and press overhead without arching.", "Complete a biceps curl, then a triceps extension or press-down.", "Use a light load and keep each repetition smooth."],
      cues: ["Keep ribs stacked over pelvis.", "Choose shoulder range that feels comfortable."],
      avoid: "Do not lean backwards to force the weight overhead.",
      easier: "Reduce the range or substitute a light band press."
    },
    "side-plank": {
      name: "Side plank", category: "Core", equipment: "Bodyweight",
      sets: 2, reps: "20–40 s / side", rest: "30–45 s", tempo: "Steady hold",
      focus: ["Obliques", "Lateral trunk", "Pelvic control"], visual: "core",
      why: "Trains the trunk to resist side-bending, which is useful for controlling posture while running.",
      steps: ["Lie on your side with elbow under shoulder and knees bent or legs straight.", "Lift your hips so shoulders, hips and knees/ankles line up.", "Breathe calmly and hold without letting your hips sag."],
      cues: ["Push the floor away through your forearm.", "Keep your neck long."],
      avoid: "Stop if you feel sharp pain at the side of your hip or shoulder.",
      easier: "Keep knees bent and use a shorter hold."
    },
    "kettlebell-deadlift": {
      name: "Elevated kettlebell deadlift", category: "Strength", equipment: "Kettlebell and stable blocks",
      sets: 3, reps: "6–8", rest: "60–90 s", tempo: "Controlled",
      focus: ["Glutes", "Hamstrings", "Posterior chain"], visual: "hinge",
      why: "Develops hinge strength with a higher starting position to avoid unnecessary depth.",
      steps: ["Place the kettlebell on stable blocks so the handle starts around mid-shin or higher.", "Stand close, hinge at your hips and hold the handle firmly.", "Brace gently and stand by pushing through the floor.", "Lower it to the blocks under control."],
      cues: ["Keep the bell close.", "Finish tall without leaning backwards."],
      avoid: "Do not use unstable objects as blocks. Stop if the hinge provokes the hip.",
      easier: "Use a lighter kettlebell or bilateral Romanian deadlift with a shorter range."
    },
    "single-leg-hinge": {
      name: "Supported single-leg Romanian deadlift", category: "Control", equipment: "Dumbbell optional and support",
      sets: 2, reps: "8 / leg", rest: "45–60 s", tempo: "Slow and steady",
      focus: ["Glutes", "Hamstrings", "Balance"], visual: "hinge",
      why: "Develops single-leg balance and hip control with a small amount of external load.",
      steps: ["Stand beside a wall or rack and hold it lightly with one hand.", "Keep a small bend in the stance knee and hinge your trunk forward as the free leg travels behind.", "Stop before your pelvis rotates or symptoms appear.", "Return to standing with control."],
      cues: ["Use the support; balance is not the goal.", "Keep hips pointing toward the floor."],
      avoid: "If it triggers front- or side-of-hip pain, substitute a bilateral hinge.",
      easier: "Do a bilateral Romanian deadlift or banded good morning."
    },
    "machine-chest-row": {
      name: "Machine chest press + seated cable row", category: "Upper body", equipment: "Chest-press machine and cable",
      sets: 3, reps: "8–12 each", rest: "60 s after pair", tempo: "Controlled",
      focus: ["Chest", "Back", "Arms"], visual: "upper",
      why: "A supported push/pull pairing that limits unnecessary lower-back fatigue.",
      steps: ["Chest press: set handles around mid-chest, press without shrugging, and return slowly.", "Cable row: sit tall, pull the handle toward the lower ribs and avoid rocking backwards.", "Complete both exercises before resting."],
      cues: ["Keep shoulders relaxed.", "Control the return on each repetition."],
      avoid: "Do not use momentum to finish the row.",
      easier: "Lower the machine weight."
    },
    "reverse-fly-arms": {
      name: "Reverse fly + biceps/triceps", category: "Upper body", equipment: "Reverse-fly machine or cables",
      sets: 2, reps: "12–15 each", rest: "45 s", tempo: "Controlled",
      focus: ["Rear shoulders", "Upper back", "Arms"], visual: "upper",
      why: "Completes upper-body training with emphasis on rear delts and arm muscles.",
      steps: ["Reverse fly: move arms out and back with a soft elbow bend, keeping shoulders away from your ears.", "Complete biceps curls and triceps extensions with a load you can control.", "Keep the trunk still throughout."],
      cues: ["Use a modest range and light-to-moderate resistance.", "Avoid swinging."],
      avoid: "Do not force the shoulders into a painful range.",
      easier: "Use band pull-aparts and light band arm work."
    },
    "bird-dog": {
      name: "Bird dog", category: "Core", equipment: "Bodyweight",
      sets: 2, reps: "8 / side", rest: "30–45 s", tempo: "2–3 s reach",
      focus: ["Trunk stability", "Back", "Pelvic control"], visual: "core",
      why: "Practises trunk control while the limbs move, without needing heavy spinal loading.",
      steps: ["Start on hands and knees with hands under shoulders and knees under hips.", "Reach one arm forward and the opposite leg back, keeping your pelvis level.", "Pause briefly, then return and alternate sides."],
      cues: ["Imagine balancing a cup on your lower back.", "Use a small range if you wobble."],
      avoid: "Do not arch your back or rush the repetitions.",
      easier: "Move one limb at a time."
    },
    "bodyweight-squat": {
      name: "Bodyweight squat", category: "Strength", equipment: "Bodyweight",
      sets: 2, reps: "12–15", rest: "45–60 s", tempo: "2–3 s down",
      focus: ["Quads", "Glutes"], visual: "squat",
      why: "Provides lower-body volume at home without adding external load.",
      steps: ["Stand with feet about shoulder-width apart.", "Sit your hips down and back while bending your knees.", "Pause at a comfortable depth and stand smoothly."],
      cues: ["Keep heels down.", "Use a smaller depth if the hip feels pinched."],
      avoid: "Do not force depth or add speed when symptoms are active.",
      easier: "Use a higher target behind you, such as a firm chair."
    },
    "band-good-morning": {
      name: "Banded good morning", category: "Strength", equipment: "Long resistance band",
      sets: 2, reps: "12–15", rest: "45–60 s", tempo: "3 s down",
      focus: ["Glutes", "Hamstrings", "Posterior chain"], visual: "hinge",
      why: "A home alternative to the Romanian deadlift using band resistance.",
      steps: ["Stand on the middle of a long band and position it securely across your upper back, away from your neck.", "Unlock your knees and push your hips back while keeping your torso braced.", "Stop before your back rounds, then stand by driving your hips forward."],
      cues: ["Keep the band secure and tension manageable.", "Keep your spine long."],
      avoid: "Never place a band across the front of your neck or face.",
      easier: "Do the same hip hinge without the band."
    },
    "wall-tibialis": {
      name: "Wall tibialis raise", category: "Lower leg", equipment: "Wall and bodyweight",
      sets: 2, reps: "15–25", rest: "30–45 s", tempo: "Controlled",
      focus: ["Front of shin", "Ankle control"], visual: "shin",
      why: "A convenient home variation for strengthening the muscles that lift your toes.",
      steps: ["Lean against a wall and place your feet slightly forward.", "Keep your heels down as you lift your toes toward your shins.", "Lower slowly and repeat without rocking the trunk."],
      cues: ["Start with feet closer to the wall if needed.", "Use a pain-free range."],
      avoid: "Focal bony shin pain needs assessment, not more repetitions.",
      easier: "Move your feet closer to the wall."
    },
    "band-lateral-walk": {
      name: "Banded lateral walk", category: "Hip stability", equipment: "Loop resistance band",
      sets: 2, reps: "10–15 steps / direction", rest: "45 s", tempo: "Small controlled steps",
      focus: ["Gluteus medius", "Lateral hip"], visual: "abduction",
      why: "Builds lateral hip endurance for controlling the pelvis while standing on one leg.",
      steps: ["Place a loop band above your knees; use an ankle placement only if the easier position is comfortable.", "Stand in a shallow athletic stance with hips level.", "Step sideways while maintaining band tension, then return the other way."],
      cues: ["Keep toes pointing forward.", "Avoid rocking your trunk side to side."],
      avoid: "Do not hold a deep squat if it irritates your hip.",
      easier: "Use a lighter band and a taller stance."
    },
    "pushup-band-row": {
      name: "Push-up + seated band row", category: "Upper body", equipment: "Bodyweight and long resistance band",
      sets: 2, reps: "8–15 push-ups / 12–20 rows", rest: "45 s after pair", tempo: "Controlled",
      focus: ["Chest", "Back", "Shoulders", "Arms"], visual: "upper",
      why: "A simple home push/pull superset for the chest, shoulders, upper back and arms.",
      steps: ["Push-up: keep your body in a straight line, lower your chest under control and press the floor away.", "Band row: sit with legs extended or slightly bent, loop the band securely around your feet and pull elbows back toward your ribs.", "Complete both movements before resting."],
      cues: ["Elevate your hands for easier push-ups.", "Keep your torso still during rows."],
      avoid: "Check the band for damage and make sure it cannot slip off your feet.",
      easier: "Do wall or counter push-ups and use a lighter band."
    },
    "band-pullapart": {
      name: "Band pull-apart", category: "Upper body", equipment: "Light resistance band",
      sets: 2, reps: "15–20", rest: "30–45 s", tempo: "Pause open",
      focus: ["Rear shoulders", "Upper back", "Postural endurance"], visual: "upper",
      why: "Adds low-fatigue rear-shoulder and upper-back work to balance pushing exercises.",
      steps: ["Hold a light band at shoulder height with arms extended in front of you.", "Pull your hands apart by moving from the shoulders until the band approaches your chest.", "Return slowly without shrugging."],
      cues: ["Keep your ribs down.", "Use a light band to preserve control."],
      avoid: "Do not pull into shoulder pain or bend your wrists excessively.",
      easier: "Use less band tension or a shorter range."
    },
    "band-arms": {
      name: "Band biceps curl + triceps extension", category: "Upper body", equipment: "Resistance band",
      sets: 2, reps: "12–20 each", rest: "30–45 s after pair", tempo: "Controlled",
      focus: ["Biceps", "Triceps"], visual: "upper",
      why: "Provides direct arm work with compact, portable equipment.",
      steps: ["Curl: stand on the band and curl your hands toward your shoulders, keeping elbows near your sides.", "Triceps: use a secure overhead or behind-body band position, then straighten the elbows without moving the upper arms much.", "Work smoothly and keep band tension moderate."],
      cues: ["Keep wrists straight.", "Avoid swinging your torso."],
      avoid: "Check the band and anchor before every set; never aim a stretched band toward your face.",
      easier: "Use a lighter band or do fewer repetitions."
    },
    "bent-knee-calf": {
      name: "Bent-knee calf raise", category: "Lower leg", equipment: "Bodyweight and wall support",
      sets: 2, reps: "15–25", rest: "45 s", tempo: "Pause at top",
      focus: ["Soleus", "Calf capacity"], visual: "calf",
      why: "Targets the calf with the knee bent, complementing straight-knee calf raises.",
      steps: ["Stand with feet hip-width apart and knees slightly bent.", "Maintain the knee bend as you lift your heels.", "Pause at the top and lower slowly."],
      cues: ["Keep the knee angle fairly constant.", "Hold a wall lightly for balance."],
      avoid: "Do not bounce or push through shin pain.",
      easier: "Use both legs and a smaller range."
    },
    "band-chest-row": {
      name: "Band chest press + seated band row", category: "Upper body", equipment: "Long resistance band",
      sets: 2, reps: "12–20 each", rest: "45 s after pair", tempo: "Controlled",
      focus: ["Chest", "Back", "Shoulders", "Arms"], visual: "upper",
      why: "A home push/pull pairing using one band.",
      steps: ["Chest press: loop the band around your upper back, hold the ends securely and press forward without shrugging.", "Row: sit tall with the band securely around your feet and pull your elbows back toward your ribs.", "Complete both movements before resting."],
      cues: ["Keep wrists straight and ribs stacked.", "Use a controlled return on both movements."],
      avoid: "Inspect the band and ensure it cannot slide toward your face.",
      easier: "Use a lighter band and stand closer to the anchor if using one."
    },
    "band-overhead": {
      name: "Band overhead press", category: "Upper body", equipment: "Resistance band",
      sets: 2, reps: "10–15", rest: "45 s", tempo: "Controlled",
      focus: ["Shoulders", "Triceps"], visual: "upper",
      why: "Provides shoulder and triceps work with a portable band.",
      steps: ["Stand on the middle of the band and hold both ends at shoulder height.", "Brace gently and press overhead only through a comfortable range.", "Lower slowly, keeping the trunk still."],
      cues: ["Keep ribs down.", "Choose a band that allows a smooth lockout."],
      avoid: "Do not lean backwards to finish the press.",
      easier: "Use less band tension or a single-arm press."
    },
    "single-leg-calf": {
      name: "Supported single-leg calf raise", category: "Lower leg", equipment: "Wall or stable support",
      sets: 2, reps: "8–12 / leg", rest: "45 s", tempo: "Pause at top",
      focus: ["Calf strength", "Single-leg capacity"], visual: "calf",
      why: "Builds unilateral calf capacity in a running-relevant position.",
      steps: ["Hold a wall or rail and stand on one leg.", "Rise smoothly onto the ball of your foot.", "Pause and lower under control. Complete all reps before switching sides."],
      cues: ["Keep pressure through the big toe.", "Use the support for balance, not to pull yourself up."],
      avoid: "Do not progress to single-leg work if it worsens shin or Achilles symptoms.",
      easier: "Use two legs."
    },
    "band-squat": {
      name: "Banded squat", category: "Strength", equipment: "Loop or long resistance band",
      sets: 2, reps: "12–15", rest: "45–60 s", tempo: "2–3 s down",
      focus: ["Quads", "Glutes"], visual: "squat",
      why: "Adds light resistance to a home squat without needing weights.",
      steps: ["Use a band setup that is secure and comfortable; a loop above the knees can cue outward knee control.", "Sit down and back to a comfortable depth.", "Keep the band under steady tension and stand smoothly."],
      cues: ["Keep knees following your toes.", "Maintain the whole foot on the floor."],
      avoid: "Do not let the band pull your knees inward or force a deep range.",
      easier: "Use a bodyweight squat."
    },
    "wall-sit": {
      name: "Shallow wall sit", category: "Control", equipment: "Wall and bodyweight",
      sets: 2, reps: "20–40 s", rest: "45 s", tempo: "Steady hold",
      focus: ["Quadriceps", "Knee capacity"], visual: "squat",
      why: "Builds quadriceps endurance with a controlled, static position.",
      steps: ["Place your back against a wall and walk your feet forward.", "Slide down only to a comfortable shallow squat position.", "Hold while breathing normally, then stand up smoothly."],
      cues: ["Keep feet flat and knees aligned with toes.", "Start higher than a 90-degree knee bend."],
      avoid: "Do not hold a deep position if it provokes hip pain.",
      easier: "Use a very shallow wall sit for 10–20 seconds."
    },
    "side-lying-abduction": {
      name: "Side-lying hip abduction", category: "Hip stability", equipment: "Loop band optional",
      sets: 2, reps: "12–20 / side", rest: "30–45 s", tempo: "2 s up / 3 s down",
      focus: ["Gluteus medius", "Lateral hip"], visual: "abduction",
      why: "Trains the lateral hip muscles in a supported position.",
      steps: ["Lie on your side with your bottom knee bent and top leg straight.", "Keep the top hip stacked over the bottom hip and lift the upper leg slightly behind your body line.", "Lower slowly. Add a light band above the knees only if comfortable and appropriate to the setup."],
      cues: ["Keep toes pointing forward.", "Lift only as high as you can without rolling your pelvis."],
      avoid: "If this reproduces pain at the outside of your hip, stop and seek individual guidance.",
      easier: "Use no band and a smaller range."
    }
  };

  var workouts = [
    { id: "gym-a", setting: "gym", code: "GYM A", title: "Foundational strength", time: "45–50 min", minutes: 48, desc: "Posterior chain, knee control and a balanced upper-body finisher.", tags: ["Quads + glutes", "Calves + shins"], goal: "Build a strong base", exercises: ["hip-flexor", "goblet-squat", "romanian-deadlift", "step-down", "standing-calf", "tibialis-raise", "hip-abduction-machine", "bench-row-gym", "face-pull-curl", "triceps-pallof"] },
    { id: "gym-b", setting: "gym", code: "GYM B", title: "Knee & soleus strength", time: "40–50 min", minutes: 45, desc: "Supported leg work, hamstrings and bent-knee calf strength.", tags: ["Knee control", "Soleus"], goal: "Build leg capacity", exercises: ["hip-flexor", "leg-press", "seated-leg-curl", "step-down", "seated-calf", "tibialis-raise", "hip-abduction-machine", "incline-pulldown", "shoulder-arms", "side-plank"] },
    { id: "gym-c", setting: "gym", code: "GYM C", title: "Posterior chain & stability", time: "45–50 min", minutes: 48, desc: "Hinge strength and single-leg control, without maximal lifting.", tags: ["Glutes + hamstrings", "Single-leg control"], goal: "Build resilient strength", exercises: ["hip-flexor", "kettlebell-deadlift", "single-leg-hinge", "step-down", "standing-calf", "tibialis-raise", "hip-abduction-machine", "machine-chest-row", "reverse-fly-arms", "bird-dog"] },
    { id: "home-a", setting: "home", code: "HOME A", title: "Foundational bodyweight", time: "28–32 min", minutes: 30, desc: "Simple squat and hinge strength, with a compact upper-body circuit.", tags: ["Bodyweight + band", "Calves + shins"], goal: "Train anywhere", exercises: ["hip-flexor", "bodyweight-squat", "band-good-morning", "step-down", "standing-calf", "wall-tibialis", "pushup-band-row", "band-pullapart", "band-arms", "side-plank"] },
    { id: "home-b", setting: "home", code: "HOME B", title: "Hip stability & soleus", time: "28–35 min", minutes: 32, desc: "Controlled single-leg work, lateral hip and bent-knee calf strength.", tags: ["Band + bodyweight", "Single-leg control"], goal: "Build movement control", exercises: ["hip-flexor", "single-leg-hinge-home", "step-down", "bent-knee-calf", "band-lateral-walk", "wall-tibialis", "band-chest-row", "band-overhead", "band-arms", "bird-dog"] },
    { id: "home-c", setting: "home", code: "HOME C", title: "Quadriceps & lower-leg capacity", time: "28–33 min", minutes: 31, desc: "Static and dynamic quad work, step-downs and calf strength.", tags: ["Quads", "Lower-leg capacity"], goal: "Build repeatable capacity", exercises: ["hip-flexor", "wall-sit", "band-squat", "step-down", "single-leg-calf", "wall-tibialis", "side-lying-abduction", "pushup-band-row", "band-pullapart", "band-arms", "side-plank"] }
  ];

  function readState() {
    try {
      var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (!parsed || typeof parsed !== "object") parsed = {};
      if (!parsed.preferences) parsed.preferences = {};
      if (!parsed.history) parsed.history = [];
      return parsed;
    } catch (error) {
      return { preferences: {}, history: [], session: null };
    }
  }
  var state = readState();
  if (![1, 2, 3].includes(Number(state.preferences.hipStage))) state.preferences.hipStage = 1;
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) {}
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function byId(id) { return workouts.find(function (workout) { return workout.id === id; }); }
  function getStage() { return Number(state.preferences.hipStage) || 1; }

  function makeHipFlexor(stage, setting) {
    var equipment = setting === "gym" ? "Bodyweight; band or low cable for later stages" : "Bodyweight or resistance band";
    if (stage === 2) return {
      id: "hip-flexor-stage-2", name: "Seated resisted hip flexion", category: "Hip flexor", equipment: equipment,
      sets: 2, reps: "8–10 / side", rest: "30–45 s", tempo: "2 s up / 3 s down",
      focus: ["Hip flexors", "Controlled knee lift"], visual: "hip",
      why: "Adds gentle dynamic resistance to the front-of-hip muscles. Progress to this only after the isometric version is comfortable and symptoms are improving.",
      steps: ["Sit tall near the front of a stable chair, with your knee comfortably bent.", "Loop a light band securely around your foot and hold the other end so it provides gentle resistance as you lift.", "Lift the knee a small distance without leaning back or hiking your pelvis.", "Lower for about 3 seconds. Complete both sides."],
      cues: ["Start with a very light band.", "Keep movement smooth; a small range is enough."],
      avoid: "Do not push through front- or side-of-hip pain. Skip resisted movement if it causes a flare during exercise or by the next morning.",
      easier: "Return to Stage 1 seated isometric hip flexion."
    };
    if (stage === 3) return {
      id: "hip-flexor-stage-3", name: "Standing resisted hip flexion", category: "Hip flexor", equipment: setting === "gym" ? "Low cable or resistance band" : "Resistance band",
      sets: 2, reps: "8–10 / side", rest: "30–45 s", tempo: "2 s up / 3 s down",
      focus: ["Hip flexors", "Upright running posture"], visual: "hip",
      why: "Builds resisted knee-drive strength in standing. This is a later progression, not a test to push through pain.",
      steps: ["Secure a light band low behind you and loop it around your ankle, or use a low cable with an ankle strap.", "Stand tall, hold a stable support and gently brace your trunk.", "Drive the knee forward and upward only through a comfortable range; do not lean backwards.", "Lower slowly and repeat, then switch sides."],
      cues: ["Keep pelvis level and trunk quiet.", "Start with low resistance and a small range."],
      avoid: "Do not use a heavy band or cable while symptoms are active. Regress if the outside or front of the hip becomes sore.",
      easier: "Use Stage 2 seated resisted hip flexion, or Stage 1 isometrics."
    };
    return {
      id: "hip-flexor-stage-1", name: "Seated isometric hip flexion", category: "Hip flexor", equipment: "Chair and your hand",
      sets: 4, reps: "20 s / side", rest: "30–45 s", tempo: "Steady hold",
      focus: ["Hip flexors", "Isometric strength"], visual: "hip",
      why: "Starts with a low-movement contraction of the hip flexors. The goal is tolerable loading, not maximum effort.",
      steps: ["Sit upright on a stable chair with your hip and knee in a comfortable position.", "Place your hand over the front of your thigh, just above the knee.", "Try to lift your thigh while your hand pushes down enough to prevent movement.", "Hold at a moderate effort while breathing normally; switch sides after each hold."],
      cues: ["Use about 4–6 out of 10 effort, not a maximal push.", "Keep the trunk upright and pelvis still."],
      avoid: "Ideally this is pain-free. Stop if it causes sharp pain or increases symptoms at the front or side of the hip.",
      easier: "Use less effort or a shorter hold. If even a gentle isometric hurts, pause direct loading and get individual clinical advice."
    };
  }

  function resolveExercise(id, setting) {
    if (id === "hip-flexor") return makeHipFlexor(getStage(), setting);
    if (id === "single-leg-hinge-home") {
      var source = catalog["single-leg-hinge"];
      var copy = Object.assign({}, source);
      copy.id = "single-leg-hinge-home";
      copy.name = "Supported single-leg hip hinge";
      copy.equipment = "Wall support; bodyweight";
      copy.sets = 2;
      copy.reps = "8 / leg";
      copy.why = "A balance-supported hip hinge to practise single-leg control without weights.";
      copy.easier = "Use a bilateral banded good morning if this brings on hip pain.";
      return copy;
    }
    return catalog[id] || {
      id: id, name: id, category: "Strength", equipment: "See workout plan", sets: 2, reps: "8–12", rest: "45 s", tempo: "Controlled",
      focus: ["General strength"], visual: "squat", why: "Move with control and use a comfortable range.",
      steps: ["Set up carefully.", "Move slowly through a comfortable range.", "Return to the start and repeat."],
      cues: ["Keep your breathing steady.", "Choose a resistance you can control."], avoid: "Stop if pain increases.", easier: "Reduce the range or resistance."
    };
  }

  function listItems(items, numbered) {
    return '<ol class="step-list">' + items.map(function (item, index) {
      return '<li><span class="step-num">' + (index + 1) + '</span><span>' + escapeHtml(item) + '</span></li>';
    }).join("") + '</ol>';
  }
  function cueItems(items) {
    return '<div class="cue-list">' + items.map(function (item) {
      return '<div class="cue"><span class="cue-mark">✓</span><span>' + escapeHtml(item) + '</span></div>';
    }).join("") + '</div>';
  }

  function pose(kind, x, moved) {
    var stroke = "#344b3c";
    var accent = "#e76d43";
    var ox = x;
    var headY = 38, shX = ox, shY = 56, hipX = ox, hipY = 96;
    var arms = "M " + shX + " " + shY + " L " + (ox - 20) + " " + (shY + 24) + " M " + shX + " " + shY + " L " + (ox + 20) + " " + (shY + 24);
    var legs = "M " + hipX + " " + hipY + " L " + (ox - 9) + " 125 L " + (ox - 10) + " 151 M " + hipX + " " + hipY + " L " + (ox + 10) + " 125 L " + (ox + 11) + " 151";
    var torso = "M " + shX + " " + shY + " L " + hipX + " " + hipY;
    if (kind === "hip") {
      headY = 53; shY = 70; hipY = 104;
      torso = "M " + ox + " 69 L " + ox + " 103";
      arms = "M " + ox + " 76 L " + (ox - 17) + " 98 M " + ox + " 76 L " + (ox + 16) + " 98";
      legs = moved
        ? "M " + ox + " 103 L " + (ox + 30) + " 114 L " + (ox + 38) + " 147 M " + ox + " 103 L " + (ox + 22) + " 83 L " + (ox + 39) + " 83"
        : "M " + ox + " 103 L " + (ox + 32) + " 115 L " + (ox + 38) + " 147 M " + ox + " 103 L " + (ox + 25) + " 124 L " + (ox + 45) + " 124";
    } else if (kind === "squat" || kind === "step") {
      if (moved) {
        headY = 52; shY = 66; hipY = 96;
        torso = "M " + ox + " 66 L " + (ox + 2) + " 96";
        arms = "M " + ox + " 70 L " + (ox - 18) + " 85 M " + ox + " 70 L " + (ox + 18) + " 85";
        legs = "M " + (ox + 2) + " 96 L " + (ox - 18) + " 112 L " + (ox - 25) + " 143 M " + (ox + 2) + " 96 L " + (ox + 22) + " 111 L " + (ox + 28) + " 143";
      }
      if (kind === "step" && moved) {
        legs = "M " + hipX + " " + hipY + " L " + (ox - 8) + " 123 L " + (ox - 6) + " 149 M " + hipX + " " + hipY + " L " + (ox + 23) + " 116 L " + (ox + 38) + " 136";
      }
    } else if (kind === "hinge") {
      if (moved) {
        headY = 55; shX = ox - 18; shY = 65; hipX = ox + 1; hipY = 101;
        torso = "M " + shX + " " + shY + " L " + hipX + " " + hipY;
        arms = "M " + shX + " " + shY + " L " + (ox - 28) + " 95 M " + shX + " " + shY + " L " + (ox - 12) + " 95";
        legs = "M " + hipX + " " + hipY + " L " + (ox - 8) + " 123 L " + (ox - 12) + " 151 M " + hipX + " " + hipY + " L " + (ox + 14) + " 123 L " + (ox + 18) + " 151";
      }
    } else if (kind === "calf" || kind === "shin") {
      arms = "M " + shX + " " + shY + " L " + (ox - 18) + " 76 M " + shX + " " + shY + " L " + (ox + 18) + " 76";
      legs = moved && kind === "calf"
        ? "M " + hipX + " " + hipY + " L " + (ox - 7) + " 126 L " + (ox - 8) + " 137 M " + hipX + " " + hipY + " L " + (ox + 8) + " 126 L " + (ox + 13) + " 137"
        : moved && kind === "shin"
          ? "M " + hipX + " " + hipY + " L " + (ox - 8) + " 125 L " + (ox - 14) + " 145 M " + hipX + " " + hipY + " L " + (ox + 9) + " 125 L " + (ox + 19) + " 140"
          : legs;
    } else if (kind === "abduction") {
      if (moved) legs = "M " + hipX + " " + hipY + " L " + (ox - 8) + " 125 L " + (ox - 9) + " 151 M " + hipX + " " + hipY + " L " + (ox + 27) + " 117 L " + (ox + 42) + " 117";
    } else if (kind === "core") {
      headY = 92; shY = 105; hipY = 111;
      torso = "M " + (ox - 13) + " 106 L " + (ox + 18) + " 111";
      arms = "M " + (ox - 13) + " 106 L " + (ox - 27) + " 125 M " + (ox - 13) + " 106 L " + (ox - 1) + " 128";
      legs = "M " + (ox + 18) + " 111 L " + (ox + 30) + " 126 L " + (ox + 47) + " 126 M " + (ox + 18) + " 111 L " + (ox + 30) + " 139 L " + (ox + 49) + " 139";
    } else if (kind === "upper") {
      headY = 40; shY = 58; hipY = 101;
      torso = "M " + shX + " " + shY + " L " + hipX + " " + hipY;
      arms = moved
        ? "M " + shX + " " + shY + " L " + (ox - 22) + " 42 M " + shX + " " + shY + " L " + (ox + 22) + " 42"
        : "M " + shX + " " + shY + " L " + (ox - 22) + " 80 M " + shX + " " + shY + " L " + (ox + 22) + " 80";
    }
    var circle = '<circle cx="' + ox + '" cy="' + headY + '" r="9" fill="#f0a57f" stroke="' + stroke + '" stroke-width="2"/>';
    var limbs = '<path d="' + torso + '" fill="none" stroke="' + stroke + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="' + arms + '" fill="none" stroke="' + stroke + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="' + legs + '" fill="none" stroke="' + stroke + '" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>';
    var highlight = moved ? '<circle cx="' + ox + '" cy="' + (kind === "hip" ? 103 : 96) + '" r="7" fill="' + accent + '" opacity=".92"/>' : "";
    return '<g class="' + (moved ? "pose-end" : "pose-start") + '">' + limbs + circle + highlight + '</g>';
  }

  function illustration(ex) {
    var kind = ex.visual || "squat";
    var title = ex.name.replace(/&/g, "and");
    var step = kind === "step";
    return '<div class="demo-topline"><span>FORM GUIDE</span><span class="demo-label">ILLUSTRATED MOVEMENT</span></div>' +
      '<div class="demo-art"><svg viewBox="0 0 340 190" role="img" aria-label="Simplified illustrated start and movement positions for ' + escapeHtml(title) + '">' +
      '<defs><pattern id="grid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M 18 0 L 0 0 0 18" fill="none" stroke="#dce5db" stroke-width=".7"/></pattern></defs>' +
      '<rect width="340" height="190" fill="#f5f8f2"/><rect width="340" height="190" fill="url(#grid)" opacity=".62"/>' +
      '<path d="M 20 153 H 320" stroke="#c6d5c6" stroke-width="2" stroke-linecap="round"/>' +
      (step ? '<rect x="43" y="132" width="77" height="21" rx="3" fill="#d4e0d2" stroke="#a8bba9"/><rect x="208" y="132" width="77" height="21" rx="3" fill="#d4e0d2" stroke="#a8bba9"/>' : '') +
      pose(kind, 84, false) + pose(kind, 247, true) +
      '<g class="motion-arrow"><path d="M 145 78 H 190" stroke="#e76d43" stroke-width="4" stroke-linecap="round"/><path d="M 181 69 L 191 78 L 181 87" fill="none" stroke="#e76d43" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<text x="84" y="176" fill="#607367" font-size="9" font-weight="800" text-anchor="middle" letter-spacing="1.6">START</text>' +
      '<text x="247" y="176" fill="#607367" font-size="9" font-weight="800" text-anchor="middle" letter-spacing="1.6">MOVEMENT</text>' +
      '</svg></div>';
  }

  function renderSettings() {
    settingsPanel.hidden = !settingsOpen;
    settingsTrigger.setAttribute("aria-expanded", settingsOpen ? "true" : "false");
    if (!settingsOpen) return;
    var selected = getStage();
    settingsPanel.innerHTML =
      '<h2 class="settings-heading">Hip-flexor loading stage</h2>' +
      '<p class="settings-copy">The hip-flexor block appears first in every workout. Keep one stage consistent until it is comfortable during the session and the following morning.</p>' +
      '<div class="setting-row"><label for="hip-stage">Choose your current stage</label>' +
      '<select id="hip-stage">' +
      '<option value="1"' + (selected === 1 ? " selected" : "") + '>Stage 1 — seated isometric (start here)</option>' +
      '<option value="2"' + (selected === 2 ? " selected" : "") + '>Stage 2 — seated resisted knee lift</option>' +
      '<option value="3"' + (selected === 3 ? " selected" : "") + '>Stage 3 — standing resisted hip flexion</option>' +
      '</select></div>' +
      '<div class="setting-note"><strong>Symptom rule:</strong> Start with Stage 1 while the hip is irritated. Do not progress if pain increases during training or is worse the next morning. If gentle isometrics hurt, pause this block and get individual clinical guidance.</div>' +
      '<p class="settings-copy" style="margin:12px 0 0">Your preferences and set history are saved locally in this browser; no account is needed.</p>';
    var select = document.getElementById("hip-stage");
    select.addEventListener("change", function () {
      state.preferences.hipStage = Number(select.value);
      saveState();
      renderSettings();
      if (view === "player") renderPlayer();
    });
  }

  function renderHome() {
    view = "home";
    var matching = workouts.filter(function (w) { return filter === "all" || w.setting === filter; });
    var session = state.session;
    var resume = session ? byId(session.workoutId) : null;
    var cards = matching.map(function (w) {
      return '<article class="workout-card">' +
        '<div class="workout-card-top"><div><div class="workout-kicker">' + w.code + ' · ' + (w.setting === "gym" ? "EQUIPMENT" : "AT HOME") + '</div><h3>' + w.title + '</h3><p>' + w.desc + '</p></div><span class="time-badge">' + w.time + '</span></div>' +
        '<div class="workout-tags">' + w.tags.map(function (t) { return '<span class="workout-tag">' + t + '</span>'; }).join("") + '</div>' +
        '<div class="workout-card-footer"><span class="movement-count">' + w.exercises.length + ' exercise blocks</span><button type="button" class="primary-btn card-start" data-start="' + w.id + '">' + (session && session.workoutId === w.id ? "Resume →" : "Start workout →") + '</button></div>' +
        '</article>';
    }).join("");
    var resumeHtml = resume ? (function () {
      var total = resume.exercises.length;
      var progress = Math.min(total, (session.index || 0) + 1);
      return '<div class="resume-card"><div class="resume-copy"><strong>Workout in progress · ' + resume.code + '</strong><span>Exercise ' + progress + ' of ' + total + ' · Your set checks are saved on this device.</span></div><button type="button" class="primary-btn" data-resume="1">Resume →</button></div>';
    }()) : "";
    app.innerHTML =
      '<section class="hero"><div class="eyebrow">Strength that supports your miles</div><h1>Build strength.<br>Keep your stride.</h1><p>A practical gym and home rotation for runners — with direct hip-flexor loading, step-downs, calf and shin work, plus upper body and core.</p><div class="hero-stats"><span class="stat-pill"><b>06</b> guided workouts</span><span class="stat-pill"><b>28–50</b> min per session</span><span class="stat-pill"><b>Offline</b> after first load</span></div></section>' +
      resumeHtml +
      '<section class="section-header"><div><h2>Choose your session</h2><p>Pick the equipment you have today.</p></div></section>' +
      '<div class="filter-tabs" role="group" aria-label="Filter workouts">' +
      '<button type="button" class="filter-tab ' + (filter === "all" ? "active" : "") + '" data-filter="all">All 6</button>' +
      '<button type="button" class="filter-tab ' + (filter === "gym" ? "active" : "") + '" data-filter="gym">Gym</button>' +
      '<button type="button" class="filter-tab ' + (filter === "home" ? "active" : "") + '" data-filter="home">Home</button>' +
      '</div><div class="workout-grid">' + (cards || '<div class="empty-state">No workouts in this filter.</div>') + '</div>' +
      '<div class="notice"><strong>Hip-flexor first.</strong> Every workout begins with the stage you select in Settings. Start with Stage 1 while symptoms are active; progress only when symptoms remain stable during the session and the next morning.</div>' +
      '<p class="runner-note">These are general strength sessions, not a diagnosis or a substitute for an individual rehabilitation plan. If hip pain is worsening, changing location, affecting your stride, or not settling, arrange an assessment. Localised bone pain in the shin needs particular caution.</p>' +
      renderHistory();
    app.querySelectorAll("[data-filter]").forEach(function (button) {
      button.addEventListener("click", function () { filter = button.getAttribute("data-filter"); renderHome(); });
    });
    app.querySelectorAll("[data-start]").forEach(function (button) {
      button.addEventListener("click", function () { startWorkout(button.getAttribute("data-start")); });
    });
    var resumeButton = app.querySelector("[data-resume]");
    if (resumeButton) resumeButton.addEventListener("click", function () { view = "player"; renderPlayer(); });
    renderSettings();
  }

  function renderHistory() {
    var history = (state.history || []).slice(0, 3);
    if (!history.length) return '';
    return '<section class="section-header"><div><h2>Recent sessions</h2><p>Completed workouts on this device.</p></div></section><div class="summary-list">' +
      history.map(function (item) {
        var w = byId(item.workoutId);
        var date = item.date ? new Date(item.date).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";
        return '<div class="summary-row"><span>' + (w ? w.code + " · " + w.title : "Completed workout") + ' <span style="display:block;color:#8a948c;font-size:10px;margin-top:3px">' + date + '</span></span><span>' + (item.done || 0) + ' blocks</span></div>';
      }).join("") + '</div>';
  }

  function startWorkout(id) {
    var w = byId(id);
    if (!w) return;
    if (!state.session || state.session.workoutId !== id) {
      state.session = { workoutId: id, index: 0, sets: {}, completed: {}, startedAt: new Date().toISOString() };
    }
    saveState();
    view = "player";
    renderPlayer();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getCurrent() {
    var session = state.session;
    if (!session) return null;
    var w = byId(session.workoutId);
    if (!w) return null;
    if (session.index < 0) session.index = 0;
    if (session.index >= w.exercises.length) session.index = w.exercises.length - 1;
    var items = w.exercises.map(function (id) { return resolveExercise(id, w.setting); });
    return { workout: w, exercise: items[session.index], index: session.index, items: items };
  }

  function renderPlayer() {
    var current = getCurrent();
    if (!current) { renderHome(); return; }
    view = "player";
    var w = current.workout, ex = current.exercise, idx = current.index, total = current.items.length;
    var completedCount = Object.keys(state.session.completed || {}).filter(function (key) { return state.session.completed[key]; }).length;
    var stepKey = String(idx);
    var checkedCount = 0;
    for (var si = 0; si < ex.sets; si++) if (state.session.sets[stepKey + ":" + si]) checkedCount++;
    var percent = Math.round(((idx + 1) / total) * 100);
    var setsButtons = "";
    for (var s = 0; s < ex.sets; s++) {
      var done = !!state.session.sets[stepKey + ":" + s];
      setsButtons += '<button type="button" class="set-btn ' + (done ? "done" : "") + '" data-set="' + s + '" aria-pressed="' + (done ? "true" : "false") + '"><span>' + (done ? "✓ Done" : "Set") + '</span>' + (s + 1) + '</button>';
    }
    var focus = (ex.focus || []).map(function (t) { return '<span class="focus-tag">' + escapeHtml(t) + '</span>'; }).join("");
    var detail = '<section class="detail-block"><h2>How to do it</h2>' + listItems(ex.steps, true) + '</section>' +
      '<section class="detail-block"><h2>Form cues</h2>' + cueItems(ex.cues) + '</section>' +
      '<section class="detail-block"><div class="warning-block"><strong>Watch for this</strong>' + escapeHtml(ex.avoid) + '</div></section>' +
      '<section class="detail-block"><h2>Make it easier</h2><div class="cue"><span class="cue-mark">↘</span><span>' + escapeHtml(ex.easier || "Reduce resistance or range and keep the movement controlled.") + '</span></div></section>';
    var nextLabel = idx === total - 1 ? "Finish workout ✓" : "Complete & next →";
    app.innerHTML =
      '<div class="player-top"><button type="button" class="back-btn" id="back-home">← Workouts</button><div class="player-workout-label">' + w.code + ' · ' + w.time + '</div></div>' +
      '<div class="progress-wrap"><div class="progress-meta"><span><strong>Exercise ' + (idx + 1) + '</strong> of ' + total + '</span><span>' + completedCount + ' completed</span></div><div class="progress-track"><div class="progress-fill" style="width:' + percent + '%"></div></div></div>' +
      '<div class="exercise-layout"><section class="demo-wrap">' + illustration(ex) + '<div class="player-footnote">Illustrated movement guide — use the written cues below for setup and technique.</div></section>' +
      '<section class="exercise-panel"><div class="exercise-content">' +
      '<div class="exercise-number">' + String(idx + 1).padStart(2, "0") + ' / ' + String(total).padStart(2, "0") + ' · ' + escapeHtml(ex.category || "Exercise") + '</div>' +
      '<h1>' + escapeHtml(ex.name) + '</h1><p class="exercise-desc">' + escapeHtml(ex.why) + '</p>' +
      '<div class="focus-tags">' + focus + '</div>' +
      '<div class="dose-grid"><div class="dose-card"><span>Prescription</span><strong>' + ex.sets + ' × ' + escapeHtml(ex.reps) + '</strong><small>' + (ex.sets === 1 ? "one set" : "sets") + '</small></div><div class="dose-card"><span>Rest</span><strong>' + escapeHtml(ex.rest) + '</strong><small>between sets</small></div><div class="dose-card"><span>Equipment</span><strong style="font-size:11px">' + escapeHtml(ex.equipment) + '</strong><small>' + escapeHtml(ex.tempo) + '</small></div></div>' +
      '<div class="set-tracker"><div class="set-tracker-top"><strong>Track your sets</strong><span>' + checkedCount + ' of ' + ex.sets + ' checked</span></div><div class="set-buttons">' + setsButtons + '</div></div>' +
      detail +
      '</div></section></div>' +
      '<div class="exercise-nav"><button type="button" class="quiet-btn" id="previous-exercise" ' + (idx === 0 ? "disabled" : "") + '>← Previous</button><button type="button" class="primary-btn" id="next-exercise">' + nextLabel + '<span class="nav-sub">' + (idx === total - 1 ? "Save this session" : "Mark block complete and continue") + '</span></button></div>' +
      '<p class="player-footnote">You can move on before every set is checked. Your progress is saved automatically on this device.</p>';
    document.getElementById("back-home").addEventListener("click", function () { view = "home"; renderHome(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.getElementById("previous-exercise").addEventListener("click", function () {
      if (state.session.index > 0) state.session.index--;
      saveState(); renderPlayer(); window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.getElementById("next-exercise").addEventListener("click", function () {
      state.session.completed[String(idx)] = true;
      if (idx >= total - 1) finishWorkout(w, total);
      else state.session.index = idx + 1;
      saveState();
      if (view === "summary") renderSummary();
      else { renderPlayer(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
    app.querySelectorAll("[data-set]").forEach(function (button) {
      button.addEventListener("click", function () {
        var key = stepKey + ":" + button.getAttribute("data-set");
        state.session.sets[key] = !state.session.sets[key];
        saveState();
        renderPlayer();
      });
    });
    renderSettings();
  }

  function finishWorkout(w, total) {
    var done = Object.keys(state.session.completed || {}).filter(function (key) { return state.session.completed[key]; }).length;
    lastSummary = { workoutId: w.id, total: total, done: done, date: new Date().toISOString() };
    state.history = state.history || [];
    state.history.unshift({ workoutId: w.id, done: done, date: lastSummary.date });
    state.history = state.history.slice(0, 30);
    state.session = null;
    view = "summary";
    saveState();
  }

  function renderSummary() {
    if (!lastSummary) { renderHome(); return; }
    view = "summary";
    var w = byId(lastSummary.workoutId);
    app.innerHTML =
      '<section class="summary-hero"><div class="summary-check">✓</div><div class="eyebrow">Session logged</div><h1>Strong work.</h1><p>' + escapeHtml(w ? w.code + " · " + w.title : "Workout completed") + '<br>Your session is saved on this device.</p>' +
      '<div class="summary-stats"><div class="summary-stat"><strong>' + lastSummary.total + '</strong><span>Blocks</span></div><div class="summary-stat"><strong>' + lastSummary.done + '</strong><span>Marked done</span></div><div class="summary-stat"><strong>' + (w ? w.minutes : "—") + '</strong><span>Target min</span></div></div></section>' +
      '<section class="summary-list"><h2>Session recap</h2>' +
      (w ? w.exercises.map(function (id) { var ex = resolveExercise(id, w.setting); return '<div class="summary-row"><span>' + escapeHtml(ex.name) + '</span><span>✓</span></div>'; }).join("") : "") +
      '</section><div class="summary-actions"><button type="button" class="primary-btn" id="new-workout">Choose another workout →</button><button type="button" class="quiet-btn" id="repeat-workout">Repeat ' + (w ? w.code : "workout") + '</button></div>' +
      '<p class="runner-note">A completed workout is not a test of pain tolerance. If symptoms were worse later today or tomorrow morning, reduce the next session and seek guidance when appropriate.</p>';
    document.getElementById("new-workout").addEventListener("click", function () { view = "home"; renderHome(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.getElementById("repeat-workout").addEventListener("click", function () { startWorkout(lastSummary.workoutId); });
    renderSettings();
  }

  settingsTrigger.addEventListener("click", function () {
    settingsOpen = !settingsOpen;
    renderSettings();
    if (settingsOpen) settingsPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  document.getElementById("brand-home").addEventListener("click", function () {
    view = "home"; renderHome(); window.scrollTo({ top: 0, behavior: "smooth" });
  });
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("./sw.js").catch(function () {}); });
  }
  renderHome();
}());
