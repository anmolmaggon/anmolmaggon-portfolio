#!/bin/bash
cd /tmp/recovery_repo2
for i in {0..116}; do
    echo "Applying patch_$i.patch..."
    patch -p1 --no-backup-if-mismatch < "/Users/anmol.maggon/Documents/ai-exp/Gussa Portfolio Finish/patch_$i.patch" || echo "Failed to apply patch_$i.patch"
done
