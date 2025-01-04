interface SkillBarProps {
  skill: string;
  level: number;
}

const SkillBar = ({ skill, level }: SkillBarProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-text font-light">{skill}</span>
        <span className="text-muted font-light">{level}/4</span>
      </div>
      <div className="h-1 bg-gray-100 rounded">
        <div
          className="h-full bg-accent rounded transition-all duration-500"
          style={{ width: `${(level / 4) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default SkillBar;