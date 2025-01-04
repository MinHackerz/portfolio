interface SkillBarProps {
  skill: string;
  level: number;
}

const SkillBar = ({ skill, level }: SkillBarProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-primary font-light">{skill}</span>
        <span className="text-muted font-light">{level}/5</span>
      </div>
      <div className="h-1 bg-primary/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(level / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default SkillBar;