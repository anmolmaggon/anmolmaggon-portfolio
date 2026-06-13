import json
import os

with open("/Users/anmol.maggon/.gemini/antigravity-ide/brain/c492a267-f4ae-42f9-a60d-1212cc4ca6f6/.system_generated/logs/transcript.jsonl") as f:
    for line in f:
        try:
            d = json.loads(line)
            if d.get("type") == "PLANNER_RESPONSE":
                for call in d.get("tool_calls", []):
                    name = call.get("name")
                    args = call.get("args", {})
                    if name in ["replace_file_content", "multi_replace_file_content"]:
                        # remove quotes from filepath
                        filepath = args.get("TargetFile", "").strip('"')
                        if "CaseStudies.tsx" in filepath or "CaseStudyModal.tsx" in filepath or "BeforeAfterSlider.tsx" in filepath:
                            rel_path = os.path.relpath(filepath, "/Users/anmol.maggon/Documents/ai-exp/Gussa Portfolio Finish")
                            target_path = os.path.join("/tmp/recovery_repo2", rel_path)
                            
                            try:
                                with open(target_path, "r") as tf:
                                    content = tf.read()
                                
                                chunks_str = ""
                                if name == "replace_file_content":
                                    # Create a dummy chunk from top-level args
                                    tc = json.loads(args.get("TargetContent", '""'))
                                    rc = json.loads(args.get("ReplacementContent", '""'))
                                    chunks = [{"TargetContent": tc, "ReplacementContent": rc}]
                                else:
                                    chunks_str = args.get("ReplacementChunks", "[]")
                                    # chunks_str might be JSON encoded string
                                    if chunks_str.startswith('"'):
                                        chunks_str = json.loads(chunks_str)
                                    chunks = json.loads(chunks_str)
                                    
                                success = True
                                for chunk in chunks:
                                    tc = chunk.get("TargetContent", "")
                                    rc = chunk.get("ReplacementContent", "")
                                    if tc in content:
                                        content = content.replace(tc, rc)
                                    else:
                                        # Also try replacing \n with \r\n or vice versa if needed
                                        if tc.replace('\r\n', '\n') in content:
                                            content = content.replace(tc.replace('\r\n', '\n'), rc)
                                        else:
                                            success = False
                                            print(f"Target not found in {rel_path}!")
                                
                                if success:
                                    with open(target_path, "w") as tf:
                                        tf.write(content)
                                    print(f"Applied change to {rel_path}")
                                else:
                                    print(f"Failed to apply some chunks in {rel_path}")
                            except Exception as e:
                                print("Error applying", rel_path, e)
        except Exception as e:
            pass
