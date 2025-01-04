interface SkillBarProps {
  skill: string;
  level: number;
}

const SkillBar = ({ skill, level }: SkillBarProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-primary font-light">{skill}</span>
        <span className="text-primary font-light">{level}/4</span>
      </div>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-primary rounded transition-all duration-500"
          style={{ width: `${(level / 4) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default SkillBar;