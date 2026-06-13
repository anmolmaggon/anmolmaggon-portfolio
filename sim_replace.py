import json
import os

with open("/Users/anmol.maggon/.gemini/antigravity-ide/brain/c492a267-f4ae-42f9-a60d-1212cc4ca6f6/.system_generated/logs/transcript.jsonl") as f:
    for line in f:
        try:
            d = json.loads(line)
            if d.get("type") == "TOOL_CALLS":
                for call in d.get("tool_calls", []):
                    name = call.get("name")
                    args = call.get("args", {})
                    if name in ["replace_file_content", "multi_replace_file_content"]:
                        filepath = args.get("TargetFile", "")
                        if "CaseStudies.tsx" in filepath or "CaseStudyModal.tsx" in filepath or "BeforeAfterSlider.tsx" in filepath:
                            # apply to /tmp/recovery_repo2
                            rel_path = os.path.relpath(filepath, "/Users/anmol.maggon/Documents/ai-exp/Gussa Portfolio Finish")
                            target_path = os.path.join("/tmp/recovery_repo2", rel_path)
                            
                            try:
                                with open(target_path, "r") as tf:
                                    content = tf.read()
                                
                                chunks = []
                                if name == "replace_file_content":
                                    chunks = [args]
                                else:
                                    chunks = args.get("ReplacementChunks", [])
                                    
                                for chunk in chunks:
                                    tc = chunk.get("TargetContent", "")
                                    rc = chunk.get("ReplacementContent", "")
                                    if tc in content:
                                        content = content.replace(tc, rc)
                                        print(f"Applied change to {rel_path}")
                                    else:
                                        print(f"Target not found in {rel_path}!")
                                
                                with open(target_path, "w") as tf:
                                    tf.write(content)
                            except Exception as e:
                                print("Error", e)
        except:
            pass
