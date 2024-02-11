"use client";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export function GameDialog({setGameParams}: {setGameParams: Function}) {
  const [rounds, setRounds] = useState([3]);
  const [difficulty, setDifficulty] = useState("normal");
  const [local, setLocal] = useState(false);

  function handleGameParams() {
    const gameParams = {
      rounds: rounds[0],
      difficulty: difficulty,
      local: local,
    };
    setGameParams(gameParams);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="black">Play !</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Game setup !</DialogTitle>
          <DialogDescription>
            Select game mode, difficulty and number of rounds
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="rounds" className="text-center col-span-2">
              Number of rounds
            </Label>
            <Slider id="rounds" onValueChange={setRounds} defaultValue={[3]} min={1} max={9} step={2} className="place-self-center col-span-2"/>
            <Label htmlFor="rounds" className="text-center col-span-1">{rounds[0]}</Label>
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="difficulty" className="text-center col-span-2">
              Difficulty
            </Label>
            <Select defaultValue="normal" onValueChange={setDifficulty}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="local" className="text-center col-span-2">
              Local multiplayer
            </Label>
            <Switch id="local" onCheckedChange={setLocal} className="place-self-center col-span-3"/>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleGameParams}>Launch Game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

