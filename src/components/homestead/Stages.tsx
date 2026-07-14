import { AnimatedGroup } from "../Homestead"; // Adjust this import to wherever AnimatedGroup is located
import type { Mesh, Material } from "three";

export function Stages({
  nodes,
  materials,
  currentStage,
}: {
  nodes: Record<string, Mesh>;
  materials: Record<string, Material>;
  currentStage: number;
}) {
  return (
    <group position={[19.18, 0, -18.073]} rotation={[-Math.PI / 2, 0, 0]}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        {/* =====================================
            TIERS 1-5: ARRIVAL & WATER INFRASTRUCTURE
            ===================================== */}

        {/* STAGE 1: Base Land & Roads (Does not drop, dropHeight = 0) */}
        <AnimatedGroup stage={1} currentStage={currentStage} dropHeight={0}>
          <group position={[-7500, 0, 3500]} scale={[0.5, 1, 4.5]}>
            <mesh
              geometry={nodes.Env_Grass_1_SimpleFarm_0001.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-2600, -2, 2800]} scale={[54.86, 1, 63.69]}>
            <mesh
              geometry={nodes.Plane_GrassFarm_0.geometry}
              material={materials["GrassFarm.001"]}
              position={[7.26, 0, -8.79]}
            />
          </group>
          <mesh
            geometry={nodes.Env_Grass_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-1000, 0, 7000]}
            scale={[3, 1, 5]}
          />
          <mesh
            geometry={nodes.Env_Grass_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-1800, 0, 7000]}
            scale={[0.8, 1, 2]}
          />
          <mesh
            geometry={nodes.Env_Grass_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-7500, 0, 7500]}
            scale={[0.5, 1, 2]}
          />

          {/* Dirt & Roads */}
          <group position={[-2000, 0, 4999.999]}>
            <mesh
              geometry={nodes.Env_Dirt_Road_Corner_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, -0.001]}
            />
          </group>
          <group position={[-2000, 0, 4000]} scale={[1, 1, 0.5]}>
            <mesh
              geometry={nodes.Env_Dirt_Road_Straight_1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, -0.001]}
            />
          </group>
          <group position={[-5000, 0, 4000]} rotation={[0, -1.571, 0]}>
            <mesh
              geometry={nodes.road_Dirt_Driveway_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0.001]}
            />
          </group>
          <group position={[-5000, 0, 6000]} rotation={[0, -1.571, 0]}>
            <mesh
              geometry={nodes.road_Dirt_Driveway_1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0.001]}
            />
          </group>
          <group
            position={[-5000, 0, 4999.999]}
            rotation={[0, -1.571, 0]}
            scale={[2, 1, 1]}
          >
            <mesh
              geometry={nodes.road_Dirt_Straight_1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0.001]}
            />
          </group>
          <group
            position={[-7000, 0, 3000]}
            rotation={[0, 1.571, 0]}
            scale={[7, 1, 1]}
          >
            <mesh
              geometry={nodes.road_Dirt_Straight_2_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0.001]}
            />
          </group>
          <group position={[-5000, 0, 7000]} rotation={[0, -1.571, 0]}>
            <mesh
              geometry={nodes.road_Dirt_Transition_1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0.001]}
            />
          </group>
          <mesh
            geometry={nodes.Env_Dirt_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-5000, 0, 4000]}
            scale={[3, 1, 2]}
          />
          <mesh
            geometry={nodes.Env_Dirt_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[0, 0, 1000]}
            scale={[3, 1, 4]}
          />
          <mesh
            geometry={nodes.Env_Dirt_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-5000, 0, 7000]}
            scale={[3.2, 1, 2]}
          />
          <mesh
            geometry={nodes.Env_Dirt_Road_Corner_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-1000, 0, 2000]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Env_Dirt_Road_Corner_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-1000, 0, 3000]}
          />
          <mesh
            geometry={nodes.Env_Dirt_Road_End_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-1000, 0, -2000]}
          />
          <mesh
            geometry={nodes.Env_Dirt_Road_Straight_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-5000, 0, 4000]}
            rotation={[0, -1.571, 0]}
            scale={[1, 1, 1.5]}
          />
          <mesh
            geometry={nodes.Env_Dirt_Road_Straight_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-1000, 0, 2000]}
          />
          <mesh
            geometry={nodes.Env_Dirt_Road_Straight_3_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-1000, 0, 0]}
          />
          <mesh
            geometry={nodes.road_Dirt_Corner_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-7000, 0, -500]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.road_Dirt_Intersection_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-7000, 0, 6000]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.road_Dirt_Straight_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-5000, 0, -500]}
            rotation={[0, -1.571, 0]}
            scale={[9, 1, 1]}
          />
          <mesh
            geometry={nodes.road_Dirt_Straight_3_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-7000, 0, 7000]}
            rotation={[0, 1.571, 0]}
            scale={[2, 1, 1]}
          />
        </AnimatedGroup>

        {/* STAGE 2: Water Tower */}
        <AnimatedGroup stage={2} currentStage={currentStage}>
          <mesh
            geometry={nodes.Prop_Water_Tower_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[1629.806, 0, 2597.419]}
            rotation={[0, 1.571, 0]}
          />
        </AnimatedGroup>

        {/* STAGE 3: Tool Shed */}
        <AnimatedGroup stage={3} currentStage={currentStage}>
          <mesh
            geometry={nodes.Building_Shed_01_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2900, 0, 6400]}
          />
        </AnimatedGroup>

        {/* STAGE 4: Troughs */}
        <AnimatedGroup stage={4} currentStage={currentStage}>
          <group position={[-4872.725, 0, 5162.175]} rotation={[0, -1.571, 0]}>
            <mesh
              geometry={nodes.Prop_Trough_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0.001, 0, -0.001]}
            />
          </group>
          <mesh
            geometry={nodes.Prop_Trough_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3588.148, 0, 2410.9]}
            rotation={[0, -1.571, 0]}
          />
        </AnimatedGroup>

        {/* STAGE 5: The Well */}
        <AnimatedGroup stage={5} currentStage={currentStage}>
          <group position={[-1326.243, 0, 5411.097]}>
            <mesh
              geometry={nodes.Prop_Well_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0]}
            />
          </group>
        </AnimatedGroup>

        {/* =====================================
            TIERS 6-10: GARDEN & OUTHOUSE
            ===================================== */}

        {/* STAGE 6: Tilling the Soil (Grows out of ground) */}
        <AnimatedGroup stage={6} currentStage={currentStage} animType="grow">
          <mesh
            geometry={nodes.Env_Dirt_Plough_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-5000, 0, 1000]}
            scale={[4, 1, 1]}
          />
          <mesh
            geometry={nodes.Env_Dirt_Plough_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-5000, 0, 2000]}
            scale={[2, 1, 1]}
          />
          <mesh
            geometry={nodes.Env_Dirt_Plough_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2000, 0, 0]}
          />
        </AnimatedGroup>

        {/* STAGE 7: Seedlings Sprouting */}
        <AnimatedGroup stage={7} currentStage={currentStage} animType="grow">
          <mesh
            geometry={nodes.Env_Crop_Seedling_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3000, 0, 2000]}
            scale={[2, 1, 1]}
          />
          <mesh
            geometry={nodes.Env_Crop_Seedling_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[0, 0, 2000]}
            scale={[3, 1, 1]}
          />
          <mesh
            geometry={nodes.Env_Plant_Seedling_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-4125, 22, 301]}
          />
        </AnimatedGroup>

        {/* STAGE 8: Mature Crops */}
        <AnimatedGroup stage={8} currentStage={currentStage} animType="grow">
          <group position={[-5000, 0, -2000]}>
            <mesh
              geometry={nodes.Env_Crop_Cabbage_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, -1000]}>
            <mesh
              geometry={nodes.Env_Crop_Corn_Young_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, 0]}>
            <mesh
              geometry={nodes.Env_Crop_Maze_2_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <mesh
            geometry={nodes.Env_Crop_Cabbage_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-4000, 0, -2000]}
          />
          <mesh
            geometry={nodes.Env_Crop_Carrot_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2000, 0, -2000]}
          />
          <mesh
            geometry={nodes.Env_Crop_Carrot_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3000, 0, -2000]}
          />
          <mesh
            geometry={nodes.Env_Crop_Corn_Mature_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2000, 0, -1000]}
          />
          <mesh
            geometry={nodes.Env_Crop_Corn_Mature_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3000, 0, -1000]}
          />
          <mesh
            geometry={nodes.Env_Crop_Corn_Mature_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-4000, 0, -1000]}
          />
          <mesh
            geometry={nodes.Env_Crop_Maze_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3000, 0, 0]}
          />
          <mesh
            geometry={nodes.Env_Crop_Maze_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-4000, 0, 0]}
          />
          <mesh
            geometry={nodes.Env_Plant_Cabbage_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3982, 22, 301]}
          />
          <mesh
            geometry={nodes.Env_Plant_Carrot_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3835, 22, 301]}
          />
          <mesh
            geometry={nodes.Env_Plant_Corn_Mature_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3534, 20, 301]}
          />
          <mesh
            geometry={nodes.Env_Plant_Maze_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3667, 20, 301]}
          />
        </AnimatedGroup>

        {/* STAGE 9: Scarecrow (Guarding the new crops) */}
        <AnimatedGroup stage={9} currentStage={currentStage} animType="drop">
          <mesh
            geometry={nodes.Prop_ScareCrow_SimpleFarm_Scarecrow_0.geometry}
            material={materials["SimpleFarm_Scarecrow.001"]}
            position={[-4568, 24.3, 695]}
            rotation={[0, -1.571, 0]}
          />
        </AnimatedGroup>

        {/* STAGE 10: Outhouse (Humorous Wobble Animation) */}
        <AnimatedGroup stage={10} currentStage={currentStage} animType="wobble">
          <mesh
            geometry={nodes.Building_Outhouse_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[1750.014, 0, 2159.541]}
            rotation={[0, -1.571, 0]}
          />
        </AnimatedGroup>

        {/* =====================================
            TIERS 11-15: THE BARNS & ANIMALS
            ===================================== */}

        {/* STAGE 11: Small Barn / Stables */}
        <AnimatedGroup stage={11} currentStage={currentStage}>
          <mesh
            geometry={nodes.Building_Barn_Small_03_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[600, 0, -2400]}
          />
        </AnimatedGroup>

        {/* STAGE 12: Chicken Coops & Feed */}
        <AnimatedGroup stage={12} currentStage={currentStage}>
          <mesh
            geometry={nodes.Prop_Chicken_Coop_02_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3000.179, 0, 2400]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Chicken_Coop_03_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2970.486, 0, 2940.656]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Chicken_Feed_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3126.324, 0, 3015.242]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Chicken_Feed_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3153.132, 0, 2535.958]}
            rotation={[Math.PI, 0, Math.PI]}
          />
        </AnimatedGroup>

        {/* STAGE 13: Big Barn */}
        <AnimatedGroup stage={13} currentStage={currentStage}>
          <mesh
            geometry={nodes.Building_Barn_Big_01_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[1000, 0, -400]}
          />
        </AnimatedGroup>

        {/* STAGE 14: Pig Pens */}
        <AnimatedGroup stage={14} currentStage={currentStage}>
          <mesh
            geometry={nodes.Prop_Pig_Pen_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-4334.985, 0, 2600]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Pig_Pen_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[2497.334, 0, -2499.551]}
            rotation={[0, 1.571, 0]}
          />
        </AnimatedGroup>

        {/* STAGE 15: Barn Details (Hay & Pitchforks) */}
        <AnimatedGroup stage={15} currentStage={currentStage}>
          <group position={[-4293.447, 0, 6739.821]}>
            <mesh
              geometry={nodes.Prop_Haybale_Stack_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0]}
            />
          </group>
          <mesh
            geometry={nodes.Prop_Haybale_01_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-4623.134, 0, 6771.366]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_01_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-4623.134, 0, 3458.581]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_01_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3257.945, 82.198, 3544.239]}
            rotation={[Math.PI, -0.709, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_01_3_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3368.65, 82.198, 3639.292]}
            rotation={[Math.PI, -0.709, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_01_4_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3909.013, 0, 3691.381]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_02_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2552.754, 0, 2129.837]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_02_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2315.7, 0, 2129.837]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_02_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-192.781, 0, -2803.858]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_02_3_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[124.291, -7.041, -1059.382]}
            rotation={[0, -1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_02_4_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[405.504, -7.041, -1059.382]}
            rotation={[0, -1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_Stack_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[332.404, 0, -1596.211]}
          />
          <mesh
            geometry={nodes.Prop_Haybale_Stack_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[1645.308, 0, -1217.531]}
          />
          <mesh
            geometry={nodes.Prop_Haypile_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-1534.023, 0, 6638.419]}
          />
          <mesh
            geometry={nodes.Prop_PitchFork_01_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2780.115, 135.234, 3124.782]}
            rotation={[1.333, 0, 0]}
          />
          <mesh
            geometry={nodes.Prop_PitchFork_02_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2844.396, 141.721, 3123.21]}
            rotation={[1.333, 0, 0]}
          />
        </AnimatedGroup>

        {/* =====================================
            TIERS 16-20: THE MAIN HOMESTEAD
            ===================================== */}

        {/* STAGE 16: Pioneer Cottage */}
        <AnimatedGroup stage={16} currentStage={currentStage}>
          <mesh
            geometry={nodes.Building_Cottage_03_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[0, 0, 3596.307]}
          />
        </AnimatedGroup>

        {/* STAGE 17: Mailbox */}
        <AnimatedGroup stage={17} currentStage={currentStage}>
          <group
            position={[-5001.748, 38.148, 4135.983]}
            rotation={[0, 1.571, 0]}
          >
            <mesh
              geometry={nodes.Prop_Letter_Box1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.flag_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-26.701, 163.645, -26.65]}
            />
          </group>
        </AnimatedGroup>

        {/* STAGE 18: Main Farm House */}
        <AnimatedGroup stage={18} currentStage={currentStage}>
          <group position={[0, 0, 5784.549]}>
            <mesh
              geometry={nodes.Building_Farm_House_03_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, -0.001]}
            />
          </group>
        </AnimatedGroup>

        {/* STAGE 19: Inner Homestead Fences & Ranch Sign */}
        <AnimatedGroup stage={19} currentStage={currentStage}>
          <group position={[-5000, 0, 4999.999]}>
            <mesh
              geometry={nodes.Prop_Fence_Ranch_Sign_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, -0.001]}
            />
          </group>
          <group position={[-2710.649, 0, 3100]}>
            <mesh
              geometry={nodes.Prop_Fence_White_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0]}
            />
          </group>
          <group position={[-3710.649, 0, 3100]} rotation={[0, -1.571, 0]}>
            <mesh
              geometry={nodes.Prop_Fence_Gate_White_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Gate_01_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 119.085, -223.481]}
              rotation={[0, 1.555, 0]}
            />
            <mesh
              geometry={nodes.Gate_02_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 119.085, -780.489]}
            />
          </group>
          <mesh
            geometry={nodes.Prop_Fence_White_1_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3710.649, 0, 2100]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Fence_White_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2710.649, 0, 2100]}
            rotation={[0, 1.571, 0]}
          />
        </AnimatedGroup>

        {/* STAGE 20: Early Trees (Growing bare trees) */}
        <AnimatedGroup stage={20} currentStage={currentStage} animType="grow">
          <mesh
            geometry={nodes.Prop_Tree_NoApples_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[1170, 0, 2705]}
            rotation={[0, 0.287, 0]}
          />
          <mesh
            geometry={nodes.Prop_Tree_NoLemons_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[701, 0, 2250]}
          />
          <mesh
            geometry={nodes.Prop_Tree_NoOranges_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[1170, 0, 2250]}
            rotation={[0, -0.416, 0]}
          />
        </AnimatedGroup>

        {/* =====================================
            TIERS 21-25: THE PASSAGE OF TIME
            ===================================== */}

        {/* STAGE 21 (YEAR 1): Perimeter Fences */}
        <AnimatedGroup stage={21} currentStage={currentStage}>
          <group position={[-5000, 0, 4000]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, 2000]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, -1000]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_10_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, -2000]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_11_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, -3000]} rotation={[0, -1.571, 0]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_12_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-4000, 0, -3000]} rotation={[0, -1.571, 0]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_13_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-1000, 0, -3000]} rotation={[0, -1.571, 0]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_15_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, 3000]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_2_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group
            position={[2000, 0, 4999.999]}
            rotation={[Math.PI, 0, Math.PI]}
          >
            <mesh
              geometry={nodes.Prop_Fence_Brown_22_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0.001]}
            />
          </group>
          <group position={[3000, 0, 2000]} rotation={[0, 1.571, 0]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_27_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, 6000]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_3_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, 1000]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_8_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, 0]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown_9_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-7432, 0, 4954.999]} rotation={[0, 0.01, 0]}>
            <mesh
              geometry={nodes.Prop_Fence_Brown__1__SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[-5000, 0, 7000]}>
            <group
              position={[-0.001, 119.085, -223.482]}
              rotation={[0, -0.979, 0]}
            >
              <mesh
                geometry={nodes.Gate_01_1_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[-0.001, 0, 0]}
              />
            </group>
            <group
              position={[-0.001, 119.085, -780.48]}
              rotation={[0, 0.965, 0]}
            >
              <mesh
                geometry={nodes.Gate_02_1_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, 0.001]}
              />
            </group>
            <mesh
              geometry={nodes.Prop_Fence_Gate_Brown_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <mesh
            geometry={nodes.Prop_Fence_Brown_14_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3000, 0, -3000]}
            rotation={[0, -1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_16_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[0, 0, -3000]}
            rotation={[0, -1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_17_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2000, 0, -3000]}
            rotation={[0, -1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_18_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[0, 0, 7000]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_19_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[1000, 0, 7000]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_20_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[2000, 0, 7000]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_21_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[2000, 0, 6000]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_23_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[2000, 0, 4000]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_24_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[1000, 0, -3000]}
            rotation={[0, -1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_25_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[2000, 0, 3000]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_26_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[2000, 0, 2000]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_28_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[3000, 0, 1000]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_29_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[3000, 0, 0]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_30_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[3000, 0, -1000]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_31_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[3000, 0, -2000]}
            rotation={[Math.PI, 0, Math.PI]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_4_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-4000, 0, 7000]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_5_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-3000, 0, 7000]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_6_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-2000, 0, 7000]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown_7_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-1000, 0, 7000]}
            rotation={[0, 1.571, 0]}
          />
          <mesh
            geometry={nodes.Prop_Fence_Brown__2__SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[-7500, 0, -1610]}
            rotation={[0, 0.01, 0]}
          />
        </AnimatedGroup>

        {/* STAGE 22 (YEAR 2): Hand Tools & Wheelbarrows */}
        <AnimatedGroup stage={22} currentStage={currentStage}>
          <group
            position={[-3817.529, 0, 3421.572]}
            rotation={[0, 0.433, 0]}
            scale={0.642}
          >
            <group position={[0, 76.283, -195.335]}>
              <mesh
                geometry={nodes.Wheel_1_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, 0]}
              />
            </group>
            <mesh
              geometry={nodes.Prop_Wheel_Barrow_01_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
          </group>
          <group
            position={[-2701.329, 0, 5837.252]}
            rotation={[0, -0.592, 0]}
            scale={0.642}
          >
            <group position={[0, 76.283, -195.335]}>
              <mesh
                geometry={nodes.Wheel_2_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, -0.001]}
              />
            </group>
            <mesh
              geometry={nodes.Prop_Wheel_Barrow_01_1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
          </group>
        </AnimatedGroup>

        {/* STAGE 23 (YEAR 3): Mature Fruit Trees & Work Trucks */}
        <AnimatedGroup stage={23} currentStage={currentStage}>
          {/* Fruit Trees Grow */}
          <group
            position={[1750.368, -2.34, 4038.941]}
            rotation={[0, 0.464, 0]}
          >
            <mesh
              geometry={nodes.Prop_Tree_Apple_1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-0.001, 0, 0]}
            />
          </group>
          <group position={[849.562, -2.34, 2840.459]} rotation={[0, 0.464, 0]}>
            <mesh
              geometry={nodes.Prop_Tree_Apple_3_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0]}
            />
          </group>
          <group
            position={[1750.39, -2.34, 3588.074]}
            rotation={[0, -0.586, 0]}
          >
            <mesh
              geometry={nodes.Prop_Tree_Orange_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0.001, 0, 0]}
            />
          </group>
          <mesh
            geometry={nodes.Prop_Tree_Apple_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[2809.414, -2.34, 759.113]}
            rotation={[0, -0.486, 0]}
          />
          <mesh
            geometry={nodes.Prop_Tree_Apple_2_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[2802.088, -2.34, 326.441]}
            rotation={[0, 0.113, 0]}
          />
          <mesh
            geometry={nodes.Prop_Tree_Lemon_SimpleFarm_0.geometry}
            material={materials["SimpleFarm.001"]}
            position={[1750.411, -2.34, 3158.108]}
            rotation={[0, 0.361, 0]}
          />

          {/* Early Vehicles */}
          <group
            position={[-2961.359, -1.871, 5183.392]}
            rotation={[-Math.PI, 0.958, -Math.PI]}
          >
            <group position={[-135.622, 58.112, -243.814]}>
              <mesh
                geometry={nodes.Wheel_fl_14_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, 0]}
              />
            </group>
            <group position={[135.624, 58.112, -243.814]}>
              <mesh
                geometry={nodes.Wheel_fr_14_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0.001, 0, 0]}
              />
            </group>
            <group position={[-135.622, 58.112, 222.57]}>
              <mesh
                geometry={nodes.Wheel_rl_14_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, -0.001]}
              />
            </group>
            <group position={[135.623, 58.112, 222.57]}>
              <mesh
                geometry={nodes.Wheel_rr_14_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, -0.001]}
              />
            </group>
            <mesh
              geometry={nodes.Vehicle_Farm_Flatbed_02_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0.001, 0, 0]}
            />
          </group>
          <group
            position={[13.062, 0, 2440.23]}
            rotation={[-Math.PI, 1.138, -Math.PI]}
          >
            <mesh
              geometry={nodes.Vehicle_Farm_Flatbed_03_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Wheel_fl_8_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-135.623, 58.112, -243.814]}
            />
            <mesh
              geometry={nodes.Wheel_fr_8_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[135.623, 58.112, -243.814]}
            />
            <mesh
              geometry={nodes.Wheel_rl_8_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-135.623, 58.112, 222.57]}
            />
            <mesh
              geometry={nodes.Wheel_rr_8_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[135.622, 58.112, 222.57]}
            />
          </group>
        </AnimatedGroup>

        {/* STAGE 24 (YEAR 4): Classic Tractors, Haybalers & Harvesters */}
        <AnimatedGroup stage={24} currentStage={currentStage}>
          <group position={[-227.853, 0, 972.891]}>
            <mesh
              geometry={nodes.Vehicle_Farm_Ute_01_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Wheel_fl_15_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-135.78, 54.059, -217.878]}
            />
            <mesh
              geometry={nodes.Wheel_fr_15_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[135.78, 54.059, -217.878]}
            />
            <mesh
              geometry={nodes.Wheel_rl_15_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-135.78, 54.059, 224.72]}
            />
            <mesh
              geometry={nodes.Wheel_rr_15_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[135.78, 54.059, 224.72]}
            />
          </group>
          <group position={[-3170.541, 0, 3468.029]} rotation={[0, -0.88, 0]}>
            <group position={[135.78, 54.059, -217.878]}>
              <mesh
                geometry={nodes.Wheel_fr_12_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, -0.001]}
              />
            </group>
            <mesh
              geometry={nodes.Vehicle_Farm_Ute_02_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Wheel_fl_12_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-135.781, 54.059, -217.878]}
            />
            <mesh
              geometry={nodes.Wheel_rl_12_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-135.781, 54.059, 224.72]}
            />
            <mesh
              geometry={nodes.Wheel_rr_12_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[135.78, 54.059, 224.72]}
            />
          </group>
          <group position={[-4484, 0, 4490]} rotation={[0, -1.571, 0]}>
            <group position={[-135.78, 54.059, 224.72]}>
              <mesh
                geometry={nodes.Wheel_rl_4_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, 0]}
              />
            </group>
            <mesh
              geometry={nodes.Vehicle_Farm_Ute_03_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Wheel_fl_4_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-135.78, 54.059, -217.879]}
            />
            <mesh
              geometry={nodes.Wheel_fr_4_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[135.78, 54.059, -217.878]}
            />
            <mesh
              geometry={nodes.Wheel_rr_4_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[135.78, 54.059, 224.72]}
            />
          </group>
          <group position={[-3699.736, 0, 1500]} rotation={[0, -1.571, 0]}>
            <mesh
              geometry={nodes.Vehicle_Harvester_01_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Crop_Cutter_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 171.808, -617.514]}
            />
            <mesh
              geometry={nodes.Crop_Tube_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 366.045, -156.009]}
              rotation={[0, -0.827, 0]}
            />
            <mesh
              geometry={nodes.Wheel_fl_10_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-184.941, 126.698, -213.131]}
            />
            <mesh
              geometry={nodes.Wheel_fr_10_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[184.941, 126.698, -213.131]}
            />
            <mesh
              geometry={nodes.Wheel_rl_10_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-209.668, 110.959, 241.943]}
            />
            <mesh
              geometry={nodes.Wheel_rr_10_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[209.668, 110.959, 241.943]}
            />
          </group>
          <group position={[-1471.96, 0, -476.27]} rotation={[0, 1.571, 0]}>
            <mesh
              geometry={nodes.Vehicle_Harvester_Hay_01_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Hay_Cutter_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 171.808, -520.902]}
            />
            <mesh
              geometry={nodes.Hay_Tube_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-160.293, 436.725, -77.95]}
              rotation={[0, -1.571, 0]}
            />
            <mesh
              geometry={nodes.Wheel_fl_3_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-181.694, 126.698, -214.859]}
            />
            <mesh
              geometry={nodes.Wheel_fr_3_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[181.694, 126.698, -214.859]}
            />
            <mesh
              geometry={nodes.Wheel_rl_3_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-186.695, 110.959, 240.215]}
            />
            <mesh
              geometry={nodes.Wheel_rr_3_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[186.694, 110.959, 240.215]}
            />
          </group>
          <group position={[-1535.507, 4.833, 2981.15]}>
            <mesh
              geometry={nodes.Vehicle_Haybaler_03_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Hay_Collector_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 58.958, 306.362]}
            />
            <mesh
              geometry={nodes.Wheel_fl_7_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-169.62, 82.018, 530.991]}
            />
            <mesh
              geometry={nodes.Wheel_fr_7_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[169.619, 82.018, 530.991]}
            />
            <mesh
              geometry={nodes.Wheel_rl_7_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-169.62, 82.018, 713.06]}
            />
            <mesh
              geometry={nodes.Wheel_rr_7_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[169.619, 82.018, 713.06]}
            />
          </group>
          <group
            position={[-780.046, 0, -2581.117]}
            rotation={[Math.PI, 0, Math.PI]}
          >
            <group position={[-166.58, 125.564, 214.741]}>
              <mesh
                geometry={nodes.Wheel_rl_13_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, 0]}
              />
            </group>
            <mesh
              geometry={nodes.Vehicle_Tractor_Classic_01_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Wheel_fl_13_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-147.25, 71.13, -204.265]}
            />
            <mesh
              geometry={nodes.Wheel_fr_13_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[143.155, 71.13, -204.265]}
            />
            <mesh
              geometry={nodes.Wheel_rr_13_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[162.485, 125.564, 214.741]}
            />
          </group>
          <group position={[-2167.666, 0, 5398.339]}>
            <mesh
              geometry={nodes.Vehicle_Tractor_Classic_02_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0]}
            />
            <mesh
              geometry={nodes.Wheel_fl_2_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-147.25, 71.13, -204.266]}
            />
            <mesh
              geometry={nodes.Wheel_fr_2_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[143.154, 71.13, -204.266]}
            />
            <mesh
              geometry={nodes.Wheel_rl_2_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-166.58, 125.564, 214.739]}
            />
            <mesh
              geometry={nodes.Wheel_rr_2_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[162.484, 125.564, 214.739]}
            />
          </group>
        </AnimatedGroup>

        {/* STAGE 25 (YEAR 5): Modern Tractors, Diggers & The Windmill */}
        <AnimatedGroup stage={25} currentStage={currentStage}>
          {/* Plows */}
          <group position={[-2729.823, 0, 691.901]} rotation={[0, 1.571, 0]}>
            <group position={[0.868, 183.724, 1171.087]}>
              <mesh
                geometry={nodes.Plow_Wheel_Brace_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
              />
              <mesh
                geometry={nodes.Wheel_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[-99.465, -115.312, 120.641]}
              />
            </group>
            <mesh
              geometry={nodes.Vehicle_Plow_01_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Plow_Hook_01_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 167.525, 1123.325]}
            />
            <mesh
              geometry={nodes.Plow_Hook_02_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 167.525, 903.228]}
            />
            <mesh
              geometry={nodes.Plow_Hook_03_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 167.525, 683.131]}
            />
            <mesh
              geometry={nodes.Plow_Hook_04_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 167.525, 463.034]}
            />
            <mesh
              geometry={nodes.Plow_Hook_05_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 167.525, 242.938]}
            />
          </group>
          {/* Tractors & Diggers */}
          <group position={[-2729.823, 0, 691.901]} rotation={[0, 1.571, 0]}>
            <mesh
              geometry={nodes.Vehicle_Tractor_01_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Wheel_fl_6_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-143.129, 96.186, -190.265]}
            />
            <mesh
              geometry={nodes.Wheel_fr_6_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[143.128, 96.186, -190.265]}
            />
            <mesh
              geometry={nodes.Wheel_rl_6_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-164.532, 125.564, 190.163]}
            />
            <mesh
              geometry={nodes.Wheel_rr_6_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[164.532, 125.564, 190.163]}
            />
          </group>
          <group position={[-4319.04, 0, 5880.752]}>
            <group position={[-164.532, 125.564, 190.163]}>
              <mesh
                geometry={nodes.Wheel_rl_5_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0.001, 0, 0]}
              />
            </group>
            <mesh
              geometry={nodes.Vehicle_Tractor_02_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Wheel_fl_5_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-143.128, 96.186, -190.264]}
            />
            <mesh
              geometry={nodes.Wheel_fr_5_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[143.129, 96.186, -190.264]}
            />
            <mesh
              geometry={nodes.Wheel_rr_5_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[164.532, 125.564, 190.163]}
            />
          </group>
          <group position={[-3718.386, 7.539, 4827.763]}>
            <group position={[0.001, 235.099, -72.459]}>
              <group position={[-103.52, 74.584, -219.92]}>
                <mesh
                  geometry={nodes.Digger_Attachment_Mid_1_SimpleFarm_0.geometry}
                  material={materials["SimpleFarm.001"]}
                />
                <mesh
                  geometry={
                    nodes.Digger_Attachment_Bucket_1_SimpleFarm_0.geometry
                  }
                  material={materials["SimpleFarm.001"]}
                  position={[0.373, -233.31, -168.581]}
                />
              </group>
              <mesh
                geometry={nodes.Digger_Attachment_Base_1_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
              />
            </group>
            <mesh
              geometry={nodes.Vehicle_Tractor_Digger_02_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, -0.001]}
            />
            <mesh
              geometry={nodes.Wheel_fl_11_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-143.129, 96.186, -190.265]}
            />
            <mesh
              geometry={nodes.Wheel_fr_11_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[143.129, 96.186, -190.265]}
            />
            <mesh
              geometry={nodes.Wheel_rl_11_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-164.532, 125.564, 190.163]}
            />
            <mesh
              geometry={nodes.Wheel_rr_11_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[164.532, 125.564, 190.163]}
            />
          </group>
          <group position={[-516.604, 0, -980.49]}>
            <group position={[0.001, 235.099, -72.458]}>
              <group position={[-103.52, 74.584, -219.92]}>
                <mesh
                  geometry={nodes.Digger_Attachment_Mid_SimpleFarm_0.geometry}
                  material={materials["SimpleFarm.001"]}
                />
                <mesh
                  geometry={
                    nodes.Digger_Attachment_Bucket_SimpleFarm_0.geometry
                  }
                  material={materials["SimpleFarm.001"]}
                  position={[0.373, -233.31, -168.581]}
                />
              </group>
              <mesh
                geometry={nodes.Digger_Attachment_Base_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
              />
            </group>
            <mesh
              geometry={nodes.Vehicle_Tractor_Digger_03_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Wheel_fl_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-143.129, 96.186, -190.264]}
            />
            <mesh
              geometry={nodes.Wheel_fr_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[143.128, 96.186, -190.264]}
            />
            <mesh
              geometry={nodes.Wheel_rl_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-164.532, 125.564, 190.164]}
            />
            <mesh
              geometry={nodes.Wheel_rr_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[164.532, 125.564, 190.164]}
            />
          </group>
          <group
            position={[-1393.537, 4.833, 2739.849]}
            rotation={[0, -0.496, 0]}
          >
            <group position={[-143.129, 96.186, -177.327]}>
              <mesh
                geometry={nodes.Wheel_fl_9_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, 0.001]}
              />
            </group>
            <mesh
              geometry={nodes.Vehicle_Tractor_New_01_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
            <mesh
              geometry={nodes.Wheel_fr_9_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[143.128, 96.186, -177.327]}
            />
            <mesh
              geometry={nodes.Wheel_rl_9_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-164.533, 125.564, 203.1]}
            />
            <mesh
              geometry={nodes.Wheel_rr_9_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[164.532, 125.564, 203.1]}
            />
          </group>
          <group position={[-2917.497, 0, 6319.805]}>
            <group position={[-164.533, 125.564, 203.099]}>
              <mesh
                geometry={nodes.Wheel_rl_1_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, 0, 0]}
              />
            </group>
            <mesh
              geometry={nodes.Vehicle_Tractor_New_03_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[0, 0, 0]}
            />
            <mesh
              geometry={nodes.Wheel_fl_1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[-143.129, 96.186, -177.328]}
            />
            <mesh
              geometry={nodes.Wheel_fr_1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[143.128, 96.186, -177.328]}
            />
            <mesh
              geometry={nodes.Wheel_rr_1_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
              position={[164.532, 125.564, 203.099]}
            />
          </group>
          {/* The Windmill Crown Jewel */}
          <group position={[1435.408, 0, 4728.562]}>
            <group position={[0, 2484.551, 0]} rotation={[0, 0.704, -0.041]}>
              <mesh
                geometry={nodes.Windmil_Top_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
              />
              <mesh
                geometry={nodes.Windmill_Blades_SimpleFarm_0.geometry}
                material={materials["SimpleFarm.001"]}
                position={[0, -3.612, -284.215]}
              />
            </group>
            <mesh
              geometry={nodes.Building_Windmill_SimpleFarm_0.geometry}
              material={materials["SimpleFarm.001"]}
            />
          </group>
        </AnimatedGroup>
      </group>
    </group>
  );
}
